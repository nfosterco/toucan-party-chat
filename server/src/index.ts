import express from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

import db, { getContacts } from './users';
import User from './User';

const app = express();
const server = http.createServer(app);
const port = 3001;
const io = new Server(server);

app.use(express.static(path.resolve(__dirname, '../../website/build')));

server.listen(port, () => {
  console.log('listening on *:3001');
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../website/build', 'index.html'));
});

io.on('connection', (socket) => {

  socket.on('user:new', (userName: string, callback) => {
    // get current users to send back
    
    const user = new User(userName, socket);
    
    db.set(user.getToken(), user);
    
    console.log('user created: ' + userName);
    
    const contacts = getContacts();

    // let other users know about new user
    io.emit('users:toClient', contacts);

    callback({ token: user.getToken() });
  });

})