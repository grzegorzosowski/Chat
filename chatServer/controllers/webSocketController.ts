import { Application } from 'express';
import { port } from '../config';
import WebSocket from 'ws';
import Chat, { ChatType } from '../db/models/Chat';
import User from '../db/models/User';
import mongoose from 'mongoose';
import Messages, { MessagesType } from '../db/models/Messages';
import MongoStore from 'connect-mongo';

export default function initWebSocket(app: Application) {
    const server = app.listen(port, () => {
        console.log(`Server is listening on port ${port}.`);
    });
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (socket: WebSocket.WebSocket) => {
        console.log('Client connected');
        socket.on('message', reciveMessage(socket));
        socket.on('close', () => {
            console.log('Client disconnected');
        });
    });
 
    function reciveMessage(client: WebSocket) {
      console.log('Message from client: ', client)
        return async function (message: string) {
            let messageObject = JSON.parse(message);
            console.log('Message from client: ', messageObject);

            if (mongoose.Types.ObjectId.isValid(messageObject.chatID)) {
                console.log('ID of recived chat: ', messageObject.chatID, typeof messageObject.chatID);
                const findChat = await Chat.findOne({ _id: messageObject.chatID });
                console.log(
                    'ID of found chat: ',
                    JSON.stringify(findChat?._id).replace(/"/g, ''),
                    typeof JSON.stringify(findChat?._id).replace(/"/g, '')
                );
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
                client.send(JSON.stringify(messageObject));
            } else {
                console.log('ChatID is incorrect');
                console.log('ChatID: ', messageObject.chatID);
            }
        };
    }
}
