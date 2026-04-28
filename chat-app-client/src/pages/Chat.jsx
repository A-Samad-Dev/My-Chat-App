import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const room = "general";
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    socket.emit("join_room", room);

    socket.on("chat_history", (messages) => {
      console.log("Chat history:", messages);
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

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex flex-col h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white bg-blue-600 shadow-lg dark:bg-blue-900">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || "https://via.placeholder.com/40"}
            className="object-cover w-10 h-10 border-2 border-white rounded-full dark:border-gray-300"
            alt={user?.username}
          />
          <span className="text-lg font-semibold">
            {user?.username || "User"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 text-sm font-medium text-white transition rounded-full shadow-md bg-white/20 dark:bg-gray-700 hover:bg-white/30 dark:hover:bg-gray-600"
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* Logout button */}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="px-5 py-2 text-sm font-medium text-blue-600 transition bg-white rounded-full shadow-md dark:bg-gray-700 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-100 dark:bg-gray-900">
        {chat.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500 dark:text-gray-400">
              No messages yet. Start the conversation! 💬
            </p>
          </div>
        )}
        {chat.map((m, index) => {
          const isMe = m.sender === user?.username;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 animate-fadeIn ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar on the left for others */}
              {!isMe && (
                <img
                  src={m?.avatar || "https://via.placeholder.com/40"}
                  alt={m.sender}
                  className="object-cover w-8 h-8 rounded-full shadow-md"
                />
              )}

              {/* Message bubble */}
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-md transition-all duration-200 
                  ${
                    isMe
                      ? "bg-blue-500 dark:bg-blue-600 text-white rounded-br-none"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none"
                  }`}
              >
                {!isMe && (
                  <p className="mb-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {m?.sender}
                  </p>
                )}
                <p className="text-sm break-words">{m.text}</p>
                <span
                  className={`text-xs block mt-1 ${
                    isMe
                      ? "text-blue-100 dark:text-blue-200"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {m?.createdAt &&
                    new Date(m?.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
              </div>

              {/* Avatar on the right for me */}
              {isMe && (
                <img
                  src={user?.avatar || "https://via.placeholder.com/40"}
                  alt={m.sender}
                  className="object-cover w-8 h-8 rounded-full shadow-md"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center max-w-4xl gap-2 mx-auto">
          <input
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition"
            placeholder="Type a message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition shadow-md font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
