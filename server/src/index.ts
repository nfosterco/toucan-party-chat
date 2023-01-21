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

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../website/build', 'index.html'));
});

io.on('connection', (socket) => {

  socket.on('user:new', (userName: string, callback) => {
    // get current contacts to send back to new user
    const contacts = getContacts();

    const user = new User(userName, socket);
    db.set(user.getUserId(), user);

    // send userId and contacts back to new user
    callback({ userId: user.getUserId(), contacts });

    // let other users know about new user
    socket.broadcast.emit('user:new', user.toContact());
  });

})