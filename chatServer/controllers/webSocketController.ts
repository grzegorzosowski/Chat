import { Application } from "express";
import { port } from "../config";
import WebSocket from "ws";
import Chat, { ChatType } from "../db/models/Chat";
import User from "../db/models/User";


export default function initWebSocket(app: Application) {
  const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });
  const wss = new WebSocket.Server({ server });
  wss.on("connection", (socket: WebSocket.WebSocket) => {
    console.log("Client connected");
    socket.on("message", reciveMessage(wss))
    socket.on("close", () => {
      console.log("Client disconnected");
    });
  });

  function reciveMessage(wss: WebSocket.Server) {
    return async function(message: string) {
      const messageObject = JSON.parse(message);
      console.log(messageObject.chatID)
      if(messageObject.chatID === Chat.findOne({chatID: messageObject.chatID})) {
        console.log("ChatID is correct")} 
      else { 
        const user = await User.findOne({_id: messageObject.senderID});
        console.log('User pobrany z bazy: ',user)
        const newChat = new Chat<ChatType>({
        chatName: user?.nick,
        members: messageObject.members,
        });
        newChat.save().then(() => {
          console.log('Chat has been created');
        });
      }
      wss.clients.forEach((client) => {
        console.log(`This is client message: ${message}`);
        client.send(message);
      })
    }
  }
}
