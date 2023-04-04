import { Application } from 'express';
import { port } from '../config';
import WebSocket from 'ws';
import Chat from '../db/models/Chat';
import mongoose from 'mongoose';
import Messages, { MessagesType } from '../db/models/Messages';
import { sessionMiddlewear } from '../sessionMiddlewear';

interface ConnectedClient {
    socket: WebSocket;
    userID: string;
}


let actualConnectingClientID: string;

export default function initWebSocket(app: Application) {
    const server = app.listen(port, () => {
        console.log(`Server is listening on port ${port}.`);
    });
    const connectedClients: ConnectedClient[] = [];
    const wss = new (require('ws').Server)({
        server,
        verifyClient: async (info: any, done: any) => {
            sessionMiddlewear(info.req, {} as any, () => {
                info.session = info.req.session;
                console.log('User authenticated: ', info.req.session?.passport?.user, '')
                actualConnectingClientID = info.req.session?.passport?.user._id;
                done(info.req.session);
              });
        },
    });
    
    wss.on('connection', (socket: WebSocket.WebSocket) => {
        console.log('Client connected');
        connectedClients.push({ socket, userID: actualConnectingClientID });
        console.log('Conneted clients: ', connectedClients);
        socket.on('message', reciveMessage(socket));
        socket.on('close', () => {
            console.log('Client disconnected');
            const index = connectedClients.findIndex((client) => client.socket === socket);
            const deletedClient = connectedClients.splice(index, 1);
            console.log('Deleted client: ', deletedClient)
        });
        
    });

    function reciveMessage(client: WebSocket) {
        return async function (message: string) {
            let messageObject = JSON.parse(message);
            if (messageObject.type === 'INIT') {
                const index = connectedClients.findIndex((clientIndex) => clientIndex.socket === client);
                if (index !== -1) {
                    connectedClients[index].userID = messageObject.userId;
                }
            }
            console.log('Message from client: ', messageObject);

            if (mongoose.Types.ObjectId.isValid(messageObject.chatID)) {
                const findChat = await Chat.findOne({ _id: messageObject.chatID });
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
                connectedClients.forEach((client) => {
                    if (targetClientsIDs?.includes(client.userID)) {
                        client.socket.send(JSON.stringify(messageObject));
                        console.log('Message sent to client: ', client.userID);
                    }
                });
                //client.send(JSON.stringify(messageObject));
            } else {
                console.log('ChatID is incorrect');
                console.log('ChatID: ', messageObject.chatID);
            }
        };
    }
}
