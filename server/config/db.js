const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "chat-app-db",
  });
  console.log("MongoDB connected successfully on port" + process.env.PORT);
};

module.exports = connectDB;
