import { Application } from "express";
import { port } from "../config";
import WebSocket from "ws";
import Chat, { ChatType } from "../db/models/Chat";
import User from "../db/models/User";
import mongoose from "mongoose";

export default function initWebSocket(app: Application) {
  const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });
  const wss = new WebSocket.Server({ server });
  wss.on("connection", (socket: WebSocket.WebSocket) => {
    console.log("Client connected");
    socket.on("message", reciveMessage(wss));
    socket.on("close", () => {
      console.log("Client disconnected");
    });
  });

  function reciveMessage(wss: WebSocket.Server) {
    return async function (message: string) {
      let messageObject = JSON.parse(message);
      console.log("Message from client: ", messageObject);
      
      if (mongoose.Types.ObjectId.isValid(messageObject.chatID)) {
        console.log('ID of recived chat: ', messageObject.chatID); 
        const findChat = await Chat.findOne({ _id: messageObject.chatID});
        // if (
        //   messageObject.chatID === findChat?._id ||
        //   findChat === null ||
        //   findChat === undefined
        // ) {
        //   console.log("ChatID is correct");
        // } else {
        //   const user = await User.findOne({ _id: messageObject.senderID });
        //   console.log("User pobrany z bazy: ", user);
        //   const newChat = new Chat<ChatType>({
        //     chatName: user?.nick,
        //     members: messageObject.members,
        //   });
        //   newChat.save().then(() => {
        //     console.log("Chat has been created");
        //   });
        //   const chatObj = await Chat.findOne({ chatName: user?.nick });
        //   console.log("ChatID: ", messageObject.chatID);
        //   messageObject.chatID = JSON.stringify(chatObj?._id);
        //   console.log("ChatID po zmianie: ", messageObject.chatID);
        // }
        wss.clients.forEach((client) => {
          client.send(JSON.stringify(messageObject));
        });
      } else {
        console.log("ChatID is incorrect");
        console.log("ChatID: ", messageObject.chatID);
      }
    };
  }
}
