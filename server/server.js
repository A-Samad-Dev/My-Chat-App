const express = require("express");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");
const Message = require("./models/message");

connectDB();

const app = express();


app.use(cors({
  origin: ["http://localhost:5173", "https://mini-gchat.vercel.app"],
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: ["https://mini-gchat.vercel.app", "http://localhost:5173"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", async (room) => {
    socket.join(room);
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
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
    io.to(data.room).emit("receive_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));