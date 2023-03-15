import { Application } from "express";
import { port } from "../config";
import WebSocket from "ws";

export default function initWebSocket(app: Application) {
  const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });
  const wss = new WebSocket.Server({ server });
  wss.on("connection", (socket: WebSocket.WebSocket) => {
    console.log("Client connected");
    socket.on("message", (message: string) => {
      console.log(`This is client message: ${message}`);
      socket.send(`You sent message: ${message}`, (err) => {
        if(err) {console.log(err)}
      });
    });
    socket.on("close", () => {
      console.log("Client disconnected");
    });
  });
}
