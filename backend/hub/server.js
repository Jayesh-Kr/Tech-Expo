import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import nacl from 'tweetnacl';
import nacl_util from "tweetnacl-util";
import base58 from 'bs58';
import { Website, Validator, WebsiteTick, DownLog } from '../model/model.js';
import db from '../db/db.js';
const CALLBACKS = {};
const availableValidators = [];
const COST_PER_VALIDATION = 100; // in lamports

const wss = new WebSocketServer({ port: 8081 });

console.log("Websocket server")

wss.on('connection', async (ws) => {
    console.log(ws._eventsCount);
    ws.on('message', async (message) => {
        try {
            // console.log(JSON.parse(message.toString()));
        const data = JSON.parse(message.toString()); 

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
            console.log(`Console in line number 34 : ${data}`);
            console.log(data);
            CALLBACKS[data.data.callbackId](data);
            delete CALLBACKS[data.data.callbackId];
        }
    } catch(err) {
        console.log(err);
    }
    });

    ws.on('close', () => {
        const index = availableValidators.findIndex(v => v.socket === ws);
        if (index !== -1) availableValidators.splice(index, 1);
        console.log(`Validator removed from the array`);
    });
});

async function signupHandler(ws, { ip, publicKey, signedMessage, callbackId }) {
    const validatorDb = await Validator.findOne({ publicKey });
    console.log("Came to signUpHandler")
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
        console.log(`Validator - ${validatorDb._id} successfully added in the array`);
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
    // console.log(message);
    const messageBytes = nacl_util.decodeUTF8(message);
    // console.log(messageBytes);
    // console.log(publicKey);
    const result =  nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signature)),
        base58.decode(publicKey),
    );
    console.log(`Result : ${result}`);
    return result;
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
                if (data.type === 'validate') {
                    const { validatorId, status, latency, signedMessage,location } = data.data;
                    console.log(location);
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
}, 15 * 1000);