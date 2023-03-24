import { Request, Response } from 'express';
import Chat, { ChatType } from '../db/models/Chat';
import Messages, { MessagesType } from '../db/models/Messages';

class ChatController {
    async findChat(req: Request, res: Response) {
        const chat = await Chat.findOne({
            members: { $all: [req.body.nick, req.body.nick2] },
        });
        if (!chat) {
            const newChat = new Chat<ChatType>({
                chatName: req.body.nick + ', ' + req.body.nick2,
                members: [req.body.nick, req.body.nick2],
            });
            await newChat.save().then(() => {
                console.log('Chat has been created');
            });
            res.json(newChat);
        } else {
            res.json(chat);
        }
    }

    async getMessages(req: Request, res: Response) {
        const messages = await Messages.find({ chatID: req.body.chatID });
        console.log('Messages: ', messages);
        res.json(messages);
    }
}

export default new ChatController();
