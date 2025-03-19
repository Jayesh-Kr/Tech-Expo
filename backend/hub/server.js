import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import nacl from 'tweetnacl';
import { decodeUTF8 } from 'tweetnacl-util';
import { Website, Validator, WebsiteTick, DownLog } from '../model/model.js';

const CALLBACKS = {};
const availableValidators = [];
const COST_PER_VALIDATION = 100; // in lamports

const wss = new WebSocketServer({ port: 8081 });

wss.on('connection', async (ws) => {
    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        if (data.type === 'signup') {
            const verified = await verifyMessage(
                `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
                data.data.publicKey,
                data.data.signedMessage
            );
            if (verified) {
                await signupHandler(ws, data.data);
            }
        } else if (data.type === 'validate') {
            CALLBACKS[data.data.callbackId](data);
            delete CALLBACKS[data.data.callbackId];
        }
    });

    ws.on('close', () => {
        const index = availableValidators.findIndex(v => v.socket === ws);
        if (index !== -1) availableValidators.splice(index, 1);
    });
});

async function signupHandler(ws, { ip, publicKey, signedMessage, callbackId }) {
    const validatorDb = await Validator.findOne({ publicKey });

    if (validatorDb) {
        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                validatorId: validatorDb._id,
                callbackId,
            },
        }));

        availableValidators.push({
            validatorId: validatorDb._id,
            socket: ws,
            publicKey: validatorDb.publicKey,
        });
        return;
    }

    const newValidator = await Validator.create({
        _id: randomUUID(),
        ip,
        publicKey,
        location: 'unknown',
        pendingPayouts: 0,
    });

    ws.send(JSON.stringify({
        type: 'signup',
        data: {
            validatorId: newValidator._id,
            callbackId,
        },
    }));

    availableValidators.push({
        validatorId: newValidator._id,
        socket: ws,
        publicKey,
    });
}

async function verifyMessage(message, publicKey, signature) {
    const messageBytes = decodeUTF8(message);
    return nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signature)),
        new Uint8Array(Buffer.from(publicKey, 'hex')),
    );
}

// Website monitoring interval
setInterval(async () => {
    const websitesToMonitor = await Website.find({ disabled: false });

    for (const website of websitesToMonitor) {
        availableValidators.forEach(validator => {
            const callbackId2 = randomUUID();
            console.log(`Sending validate to ${validator.validatorId} ${website.url}`);
            validator.socket.send(JSON.stringify({
                type: 'validate',
                data: {
                    url: website.url,
                    callbackId2
                },
            }));

            CALLBACKS[callbackId2] = async (data) => {
                data = JSON.parse(data);
                if (data.type === 'validate') {
                    const { validatorId, status, latency, signedMessage,coordinates,location } = data.data;
                    const verified = await verifyMessage(
                        `Replying to ${callbackId2}`,
                        validator.publicKey,
                        signedMessage
                    );
                    if (!verified) {
                        return;
                    }
                    if(status == "Bad") {
                        // Send Email to the user with coordinates and location
                    await DownLog.create({
                        websiteId : website._id,
                        location : location,
                        coordinates : JSON.stringify(coordinates)
                    })
                    }

                    await WebsiteTick.create({
                        websiteId: website._id,
                        validatorId,
                        status,
                        latency,
                        createdAt: new Date(),
                    });

                    await Validator.findByIdAndUpdate(
                        validatorId,
                        { $inc: { pendingPayouts: COST_PER_VALIDATION } }
                    );
                }
            };
        });
    }
}, 60 * 1000);