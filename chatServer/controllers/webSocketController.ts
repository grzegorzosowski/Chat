import { Application } from 'express';
import { port } from '../config';
import WebSocket from 'ws';
import Chat from '../db/models/Chat';
import mongoose from 'mongoose';
import Messages, { MessagesType } from '../db/models/Messages';
import { sessionMiddleware } from '../sessionMiddleware';
import { UserWithId } from '../db/models/User';

interface ConnectedClient {
    socket: WebSocket;
    userID: string;
}

function getUserFromReq(req: any) {
    return req.session?.passport?.user;
}

type ConnectedClients = {
    [key: string]: Array<WebSocket>;
};

function pushConnection(obj: ConnectedClients, userId: mongoose.ObjectId, socket: WebSocket) {
    const userIdStr = String(userId);
    if (!(userIdStr in obj)) {
        obj[userIdStr] = [socket];
    } else {
        obj[userIdStr].push(socket);
    }
}

export default function initWebSocket(app: Application) {
    const server = app.listen(port, () => {
        console.log(`Server is listening on port ${port}.`);
    });
    const connectedClients: ConnectedClients = {};
    const wss = new (require('ws').Server)({
        server,
        verifyClient: async (info: any, done: any) => {
            sessionMiddleware(info.req, {} as any, () => {
                info.session = info.req.session;
                console.log('info.req: ', info.req.session)
                done(info.req.session);
            });
        },
    });

    wss.on('connection', (socket: WebSocket.WebSocket, req: any) => {
        const user = getUserFromReq(req);
        if (!user) {
            return;
        }
        console.log('user._id', user._id);
        pushConnection(connectedClients, user._id, socket);
        console.log('Conneted clients: ', connectedClients);
        socket.on('message', reciveMessage(socket, user));
        socket.on('close', () => {
            console.log('Client disconnected');
            const userId = String(user._id);
            const theRestClients = connectedClients[userId]?.filter((sock) => sock !== socket);
            if (!theRestClients || theRestClients.length === 0) {
                delete connectedClients[userId];
            } else {
                connectedClients[userId] = theRestClients;
            }
        });
    });

    function reciveMessage(client: WebSocket, user: UserWithId) {
        return async function (message: string) {
            let messageObject = JSON.parse(message);
            console.log('Message from client: ', messageObject);

            if (mongoose.Types.ObjectId.isValid(messageObject.chatID)) {
                const findChat = await Chat.findOne({ _id: messageObject.chatID });
                if (findChat?.members?.find((member) => member === String(user._id)) == null) {
                    console.warn('User does not benong to this chat', messageObject.chatID);
                    return;
                }
                if (messageObject.chatID === JSON.stringify(findChat?._id).replace(/"/g, '')) {
                    const newMessage = new Messages<MessagesType>({
                        chatID: messageObject.chatID,
                        senderID: messageObject.senderID,
                        messageID: messageObject.messageID,
                        message: messageObject.message,
                        timestamp: messageObject.timestamp,
                    });
                    await newMessage.save().then(() => {
                        console.log('Message has been created');
                    });
                }
                const targetClientsIDs = findChat?.members?.filter((member) => member !== messageObject.senderID);
                console.log('Target clients IDs: ', targetClientsIDs);
                if (targetClientsIDs) {
                    for (const targetClientId of targetClientsIDs) {
                        const targetClientSockets = connectedClients[String(targetClientId)];
                        if (targetClientSockets) {
                            for (const targetSocket of targetClientSockets) {
                                targetSocket.send(JSON.stringify(messageObject));
                                console.log('Message sent to client: ', targetClientId);
                            }
                        }
                    }
                }
                // connectedClients.forEach((client) => {
                //     if (targetClientsIDs?.includes(client.userID)) {
                //         client.socket.send(JSON.stringify(messageObject));
                //         console.log('Message sent to client: ', client.userID);
                //     }
                // });
                //client.send(JSON.stringify(messageObject));
            } else {
                console.log('ChatID is incorrect');
                console.log('ChatID: ', messageObject.chatID);
            }
        };
    }
}
