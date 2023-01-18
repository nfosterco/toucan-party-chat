import express from 'express';
import path from 'path';


const app = express();
const port = 3001;

app.use(express.static(path.resolve(__dirname, '../../website/build')));

app.listen(port, () => {
  console.log('listening on *:3001');
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../website/build', 'index.html'));
});