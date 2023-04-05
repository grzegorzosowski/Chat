import { Request, Response } from 'express';
import Chat, { ChatType } from '../db/models/Chat';
import Messages, { MessagesType } from '../db/models/Messages';
import User from '../db/models/User';

class ChatController {
    async findChat(req: Request, res: Response) {
        const chat = await Chat.findOne({
            members: { $all: [req.body.id1, req.body.id2] },
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
        console.log('req.body.groupChatID: ', req.body.groupChatID)
        const chat = await Chat.findOne({_id: req.body.groupChatID});
        console.log('Founded group chat: ', chat);
        res.json(chat);
    }

    async createChat(req: Request, res: Response) {
        const chat = await Chat.find({ chatName: req.body.chatName });
        console.log('chat: ', chat);
        if (chat.length > 0 ) {
            const newChat = new Chat<ChatType>({
                chatName: req.body.chatName + ' ' + chat.length,
                members: req.body.members.map((member: any) => member._id) + req.body.createdBy,
            });
            await newChat.save().then(() => {
                console.log('Same chatName Chat has been created');
            });
            res.json(newChat);
        } else {
            console.log('req.body.members ID: ', req.body.members.map((member: any) => member._id));
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
