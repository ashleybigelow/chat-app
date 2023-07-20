import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import formatMessage from "./data/messages.js";
import {addUser, getUser, removeUser, getUsers} from "./data/users.js";

const __dirname = path.resolve();

const PORT = 3000 || process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {'pingInterval': 45000});

io.heartbeatTimeout = 20000;
//Add our client folder as a static folder
app.use(express.static(path.join(__dirname,"client")));

//Runs when a client connects to the code
io.on("connection", (socket) => {
  //when a user joins a room
  socket.on('joinRoom', ({username, room}) => {
    const user = addUser(socket.id, username, room);
    socket.join(user.room);
    //emits a string on connection welcoming the user
    socket.emit("message", formatMessage("Bot", "Welcome to ChatApp!"));
    //Notify all other users of a new user
    socket.broadcast.to(user.room).emit("message", formatMessage("Bot", `${username} has joined the room`));
    //emit new user list to all of the users
    const users = getUsers(room);
    io.emit("userList", (users));
  });

  //emits new message to all users upon receiving a message
  socket.on("chatMessage", (message) => {
    const curr_user = getUser(socket.id);
    if (curr_user){
      socket.broadcast.to(curr_user.room).emit("message", formatMessage(curr_user.name, message));
      socket.emit("user_message", formatMessage(curr_user.name, message));
    }
  });
  //when a user disconnects
  socket.on("disconnect", () =>{ 
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", formatMessage("Bot", `user has left the chat`));
      const users = getUsers(user.room);
      io.to(user.room).emit("userList", (users));
    }
  });
});

server.listen(PORT, '0.0.0.0', () => console.log(`server running on port ${PORT}`));