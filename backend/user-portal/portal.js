import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Website, Validator, WebsiteTick } from './model/model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const token = process.env.JWT_TOKEN; // JWT token should be set in environment variables
const userId = process.env.USER_ID; // User ID should be set in environment variables

const wss = new WebSocketServer({ port: 8081 });

const hardcodedData = [
    {
        status: 'Good',
        latency: 120,
        time: new Date(),
        location: 'New York',
        websiteUrl: 'http://example.com',
    },
    {
        status: 'Bad',
        latency: 300,
        time: new Date(),
        location: 'San Francisco',
        websiteUrl: 'http://example.org',
    },
];

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        if (data.type === 'signup') {
            await signupHandler(ws, data.data);
        } else if (data.type === 'requestInitialData') {
            sendInitialData(ws);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
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
}

function sendInitialData(ws) {
    ws.send(JSON.stringify({
        type: 'initialData',
        data: hardcodedData,
    }));
}

console.log('WebSocket server running on ws://localhost:8081');

// Establish WebSocket connection to server.js
const ws = new WebSocket("ws://localhost:8081");

ws.on('message', async (event) => {
    const data = JSON.parse(event);
    if (data.type === 'initialData') {
        displayData(data.data);
        await storeDataInDatabase(data.data);
    } else if (data.type === 'error') {
        console.error(data.message);
    }
});

ws.on('open', () => {
    ws.send(JSON.stringify({
        type: 'requestInitialData',
        data: {
            token,
            userId,
        },
    }));
});

function displayData(data) {
    console.log("Displaying data on dashboard:", data);
    // Implement the logic to display data on the dashboard
}

async function storeDataInDatabase(data) {
    for (const item of data) {
        await WebsiteTick.create({
            _id: randomUUID(),
            websiteId: item.websiteId,
            validatorId: item.validatorId,
            status: item.status,
            latency: item.latency,
            createdAt: item.time,
        });
    }
}