import express from "express"
import http from "http";
import { WebSocketServer } from "ws";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
    path:'.env'
})



const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });



const connectDB  = async ()=>{
    try{

        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");
    }catch (err) {
    console.error("MongoDB connection failed", err);
    }
}

connectDB();


const MessageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  text: String,
  time: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", MessageSchema);

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", async (data) => {
    const msg = JSON.parse(data);

    // Save to DB
    const newMsg = new Message(msg);
    await newMsg.save();

    // Send to all connected users
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});


app.listen(8000 , ()=>{
    console.log("server running on port 8000");
})