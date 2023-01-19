import express from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

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
  console.log('connected!');
})