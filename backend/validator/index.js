import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import nacl from 'tweetnacl';
import { decodeUTF8 } from 'tweetnacl-util';
import { Website, Validator, WebsiteTick } from '../model/model.js';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/techexpo';
mongoose.connect(MONGODB_URI);

const availableValidators = [];
const CALLBACKS = {};
const COST_PER_VALIDATION = 100; // in lamports

const wss = new WebSocket.Server({ port: 8081 });

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
        _id: uuidv4(),
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

setInterval(async () => {
    const websitesToMonitor = await Website.find({ disabled: false });

    for (const website of websitesToMonitor) {
        availableValidators.forEach(validator => {
            const callbackId = uuidv4();
            console.log(`Sending validate to ${validator.validatorId} ${website.url}`);
            validator.socket.send(JSON.stringify({
                type: 'validate',
                data: {
                    url: website.url,
                    callbackId
                },
            }));

            CALLBACKS[callbackId] = async (data) => {
                if (data.type === 'validate') {
                    const { validatorId, status, latency, signedMessage } = data.data;
                    const verified = await verifyMessage(
                        `Replying to ${callbackId}`,
                        validator.publicKey,
                        signedMessage
                    );
                    if (!verified) {
                        return;
                    }

                    await WebsiteTick.create({
                        _id: uuidv4(),
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