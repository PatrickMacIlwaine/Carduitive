import express from 'express';
import cors from 'cors';
import { createWebSocketServer } from './utils/websocketUtils';
import { createLobbyHandler } from './controllers/lobbyController';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/create-lobby', createLobbyHandler);

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});

createWebSocketServer(8080);

console.log('WebSocket server is running on ws://localhost:8080');
