import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const room = "general";
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || {});

  useEffect(() => {
    socket.emit("join_room", room);

    socket.on("chat_history", (messages) => {
      setChat(messages);
    });

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("chat_history");
    };
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;

    const messageData = {
      room,
      sender: user?.username,
      avatar: user?.avatar,
      text: msg,
      createdAt: new Date(),
    };

    socket.emit("send_message", messageData);

    setMsg("");
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-2">
          <img
            src={user?.avatar || "https://via.placeholder.com/40"}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold">{user?.username}</span>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm hover:bg-gray-100"
        >
          Logout
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chat.map((m, index) => {
          const isMe = m.sender === user?.username;
          console.log(m, isMe);

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar in the left side for other people*/}
              {!isMe && (
                <img
                  src={
                    m?.avatar ||
                    "data:image/jpeg;base64,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"
                  }
                  alt={m.sender}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}

              {/* The Message bubble */}
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow 
    ${
      isMe
        ? "bg-blue-500 text-white rounded-br-none"
        : "bg-white text-gray-800 rounded-bl-none"
    }`}
              >
                <p className="text-sm">{m.text}</p>

                <span className="text-xs opacity-70 block mt-1">
                  {m.sender}{" "}
                  {m.createdAt &&
                    new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
              </div>

              {/* Avatar for me*/}
              {isMe && (
                <img
                  src={
                    m.avatar ||
                    "data:image/jpeg;base64,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"
                  }
                  alt={m.sender}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t flex items-center gap-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
