import { Request, Response } from 'express';
import Chat, { ChatType } from '../db/models/Chat';
import { findChatById, findChatByMembers, findChatByName, findMessagesByChatId } from '../lib/dbRequestFunctions';

type Chat = {
    id1: string;
    id2: string;
    nick1: string;
    nick2: string;
};

function isChat(obj: any): obj is Chat {
    return (
        obj != null &&
        typeof obj.id1 === 'string' &&
        typeof obj.id2 === 'string' &&
        typeof obj.nick1 === 'string' &&
        typeof obj.nick2 === 'string'
    );
}

class ChatController {
    async findChat(req: Request, res: Response) {
        const requestBody = req.body;
        console.log('Request body: ', requestBody);
        if (!isChat(requestBody)) {
            res.sendStatus(500);
            return;
        }
        const members = [requestBody.id1, requestBody.id2];
        const chat = await findChatByMembers(members);
        if (chat) {
            res.json(chat);
            return;
        }

        const newChat = new Chat<ChatType>({
            chatName: requestBody.nick1 + ', ' + requestBody.nick2,
            members: members,
        });
        await newChat.save().then(() => {
            console.log('Chat has been created');
        });
        res.json(newChat);
    }

    async findGroupChat(req: Request, res: Response) {
        const chatId = req.body.groupChatID;
        if (typeof chatId !== 'string') {
            res.sendStatus(500);
            return;
        }
        const chat = await findChatById(chatId);
        res.json(chat);
    }

    async createChat(req: Request, res: Response) {
        const chatName = req.body.chatName;
        if (typeof chatName !== 'string') {
            res.sendStatus(500);
            return;
        }
        const chat = await findChatByName(chatName);
        try {
            if (chat.length > 0) {
                const newChat = new Chat<ChatType>({
                    chatName: req.body.chatName + ' ' + chat.length,
                    members: req.body.members.map((member: any) => member._id) + req.body.createdBy,
                });
                await newChat.save().then(() => {
                    console.log('Same chatName Chat has been created');
                });
                res.json(newChat);
            } else {
                const newChat = new Chat<ChatType>({
                    chatName: req.body.chatName,
                    members: req.body.members.map((member: any) => member._id).concat(req.body.createdBy),
                });
                await newChat.save().then(() => {
                    console.log('Chat has been created');
                });
                res.json(newChat);
            }
        } catch {
            res.json('Something gone wrong');
        }
    }

    async getMessages(req: Request, res: Response) {
        const chatId = req.body.chatID;
        if (typeof chatId !== 'string') {
            res.sendStatus(500);
            return;
        }
        const messages = await findMessagesByChatId(chatId);
        res.json(messages);
    }
}

export default new ChatController();
