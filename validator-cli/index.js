#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';
import fs from 'fs';
import { WebSocket } from 'ws';
import nacl from 'tweetnacl';
import nacl_util from 'tweetnacl-util';
import axios from 'axios';
import { randomUUID } from 'crypto';
let validatorId = null;
let ws = null;
let isValidating = true;

const connectWebsocket = (privateKeyBase64) => {
    const privateKeyBytes = nacl_util.decodeBase64(privateKeyBase64);
    const keypair = nacl.sign.keyPair.fromSecretKey(privateKeyBytes);

    ws = new WebSocket("ws://localhost:8081");

    ws.onopen = async () => {
        const callbackId = randomUUID();
        const signedMessage = signMessage(
            `Signed message for ${callbackId}, ${nacl_util.encodeBase64(keypair.publicKey)}`,
            keypair
        );
        const ipResponse = await axios("https://ipinfo.io/json");
        const ip = ipResponse.data.ip;
        console.log(`I.P.  :  ${ip}`);

        ws.send(
            JSON.stringify({
                type: "signup",
                data: {
                    callbackId,
                    ip: ip,
                    publicKey: nacl_util.encodeBase64(keypair.publicKey),
                    signedMessage,
                },
            })
        );
    };

    ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "signup") {
            validatorId = data.data.validatorId;
            console.log(chalk.green(`Validator ID: ${validatorId}`));
        } else if (data.type === "validate") {
            const { url, callbackId } = data.data;
            const startTime = Date.now();
            let latency = 0;
            const signature = signMessage(`Replying to ${callbackId}`, keypair);

            try {
                const response = await fetch(url);
                const endTime = Date.now();
                latency = endTime - startTime;
                const status = response.status;
                console.log(`Response from axios `);
                console.log(response.status);
                if(response.status != 200) {
                    const locationResponse = await axios("https://ipinfo.io/json");
                    const location = locationResponse.data.city + ", " + locationResponse.data.region;
                    return ws.send(
                        JSON.stringify({
                            type: "validate",
                            data: {
                                callbackId,
                                status: "Bad",
                                latency: latency,
                                validatorId: validatorId,
                                signedMessage: signature,
                                location: location,
                            },
                        })
                    );
                }
                ws.send(
                    JSON.stringify({
                        type: "validate",
                        data: {
                            callbackId,
                            status: status === 200 ? "Good" : "Bad",
                            latency,
                            validatorId: validatorId,
                            signedMessage: signature,
                        },
                    })
                );
            } catch (error) {
                try {
                    console.log("Bad status");
                    const locationResponse = await axios("https://ipinfo.io/json");
                    const location = locationResponse.data.city + ", " + locationResponse.data.region;
                    console.log(`Location : ${location}`);
                    ws.send(
                        JSON.stringify({
                            type: "validate",
                            data: {
                                callbackId,
                                status: "Bad",
                                latency: latency,
                                validatorId: validatorId,
                                signedMessage: signature,
                                location: location,
                            },
                        })
                    );
                } catch (err) {
                    console.log(chalk.red("Error in getting the location"));
                    console.log(chalk.red(err.message));
                }
                console.error(chalk.red(error));
            }
        }
    };

    ws.onclose = () => {
        if (isValidating) {
            console.log(chalk.yellow("WebSocket disconnected. Reconnecting..."));
            setTimeout(() => connectWebsocket(privateKeyBase64), 5000);
        }
    };

    ws.onerror = (error) => {
        console.error(chalk.red("WebSocket error:"), error.message);
        ws.close();
    };
};
program
    .name('validator-cli')
    .description('CLI to connect to a WebSocket server and validate websites')
    .version('1.0.0');

program
    .command('start <privateKeyFile>')
    .description('Start the validator')
    .action((privateKeyFile) => {
        const privateKeyBase64 = fs.readFileSync(privateKeyFile, 'utf8').trim();
        connectWebsocket(privateKeyBase64);
    });

program.parse(process.argv);


function signMessage(message, keypair) {
    const messageBytes = nacl_util.decodeUTF8(message);
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
    return JSON.stringify(Array.from(signature));
}