import express from 'express';
import cors from 'cors';
import { createWebSocketServer } from './utils/websocketUtils';
import { createLobbyHandler } from './controllers/lobbyController';

const app = express();

const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || 3001; 
const WS_PORT = process.env.REACT_APP_WS_PORT || 8080; 

app.use(cors());
app.use(express.json());

app.post('/create-lobby', createLobbyHandler);

app.listen(BACKEND_PORT, () => {
  console.log(`Express server is running on http://localhost:${BACKEND_PORT}`);
});

createWebSocketServer(Number(WS_PORT));

console.log(`WebSocket server is running on http://localhost:${WS_PORT}`);
