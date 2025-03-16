import { randomUUID } from 'crypto';
import { WebSocket } from 'ws';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

const CALLBACKS = {};
// let validatorId = null;

async function main() {
    const keypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY))
    );
    const ws = new WebSocket("ws://localhost:8081");

    ws.on('message', async (event) => {
        const data = JSON.parse(event);
        if (data.type === 'signup') {
            CALLBACKS[data.data.callbackId]?.(data.data);
            delete CALLBACKS[data.data.callbackId];
        } else if (data.type === 'validate') {
            await validateHandler(ws, data.data, keypair);
        }
    });

    ws.on('open', async () => {
        const callbackId = randomUUID();
        CALLBACKS[callbackId] = (data) => {
            validatorId = data.validatorId;
        };
        const signedMessage = await signMessage(`Signed message for ${callbackId}, ${keypair.publicKey.toBase58()}`, keypair);

        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                callbackId,
                ip: '127.0.0.1',
                publicKey: keypair.publicKey.toBase58(),
                signedMessage,
            },
        }));
    });
}

async function validateHandler(ws, { url, callbackId2, websiteId }, keypair) {
    console.log(`Validating ${url}`);
    const startTime = Date.now();
    const signature = await signMessage(`Replying to ${callbackId2}`, keypair);

    try {
        const response = await fetch(url);
        const endTime = Date.now();
        const latency = endTime - startTime;
        const status = response.status;

        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId2,
                status: status === 200 ? 'Good' : 'Bad',
                latency,
                websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
    } catch (error) {
        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId2,
                status: 'Bad',
                latency: 1000,
                websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
        console.error(error);
    }
}

async function signMessage(message, keypair) {
    const messageBytes = naclUtil.decodeUTF8(message);
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
    return JSON.stringify(Array.from(signature));
}

main();

setInterval(async () => {}, 10000);
