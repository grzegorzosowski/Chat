import { Request, Response } from 'express';
import Chat, { ChatType } from '../db/models/Chat';
import Messages, { MessagesType } from '../db/models/Messages';
import User from '../db/models/User';

class ChatController {
    async findChat(req: Request, res: Response) {
        const chat = await Chat.findOne({
            members: {
                $size: 2,
                $all: [req.body.id1, req.body.id2],
            },
        });
        if (!chat) {
            const newChat = new Chat<ChatType>({
                chatName: req.body.nick1 + ', ' + req.body.nick2,
                members: [req.body.id1, req.body.id2],
            });
            await newChat.save().then(() => {
                console.log('Chat has been created');
            });
            res.json(newChat);
        } else {
            res.json(chat);
        }
    }

    async findGroupChat(req: Request, res: Response) {
        const chat = await Chat.findOne({ _id: req.body.groupChatID });
        res.json(chat);
    }

    async createChat(req: Request, res: Response) {
        const chat = await Chat.find({ chatName: req.body.chatName });
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
    }

    async getMessages(req: Request, res: Response) {
        const messages = await Messages.find({ chatID: req.body.chatID });
        res.json(messages);
    }
}

export default new ChatController();
