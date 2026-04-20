// server.js
const express = require("express");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");
const Message = require("./models/Message");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: `http://localhost:5173` },
});

io.on("connection", (socket) => {
  socket.on("join_room", async (room) => {
    socket.join(room);

    const messages = await Message.find({ room }).sort({ CreatedAT: 1 });
    socket.emit("chat_history", messages);
  });

  socket.on("send_message", async (data) => {
    const msg = await Message.create({
      room: data.room,
      sender: data.sender,
      avatar: data.avatar,
      text: data.text,
      createdAt: new Date(),
    });
    console.log(msg);
    io.to(data.room).emit("receive_message", msg);
  });
});

server.listen(process.env.PORT, () => console.log("Server running"));
