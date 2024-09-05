import { useEffect, useState } from "react";

interface GameState {
  playersConnected: number;
  playersReady: number;
  playerCount: number;
  level: number;
  win: boolean;
  loss: boolean;
  myCards: Array<number>;
  otherPlayersCards: Array<Array<number>>;
  lastPlayedCard: number;
  streamerMode: boolean;
  timeConstraint: boolean;
  playedCardsHistory: Array<number>;
  highScore: number;
  inGame: boolean;
  countdown: number;
}

const initialGameState: GameState = {
  playersConnected: 0,
  playersReady: 0,
  playerCount: 99,
  level: 1,
  win: false,
  loss: false,
  myCards: [],
  otherPlayersCards: [],
  lastPlayedCard: 0,
  streamerMode: false,
  timeConstraint: false,
  playedCardsHistory: [],
  highScore: 1,
  inGame: false,
  countdown: 0,
};

export const useWebSocket = (
  lobbyCode: string,
  clientId: string,
  SERVER_URL: string,
) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  useEffect(() => {
  if (!lobbyCode) return;

  const savedClientId = localStorage.getItem("clientId") || clientId;
  localStorage.setItem("clientId", savedClientId);

  let socket: WebSocket;
  let reconnectTimeout: NodeJS.Timeout;

  const connectWebSocket = () => {
    socket = new WebSocket(
      `${SERVER_URL}?lobbyCode=${lobbyCode}&clientId=${savedClientId}`,
    );

    socket.onopen = () => console.log("WebSocket connection established");
    
    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
      // Optional: Retry connecting after a short delay
      reconnectTimeout = setTimeout(connectWebSocket, 2000);
    };

    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      const message = JSON.parse(event.data);
      if (
        message.type === "lobbyUpdate" ||
        message.type === "fullStateUpdate"
      ) {
        setGameState((prevState) => ({
          ...prevState,
          ...message.payload,
        }));
      }
      if (message.type === "resetLobby") {
        console.log("Received resetLobby command:", message.payload);
        window.location.reload();
      }
    };

    socket.onclose = () => {
      console.log("WebSocket closed. Attempting to reconnect...");
      reconnectTimeout = setTimeout(connectWebSocket, 2000);
    };

    setWs(socket);
  };

  connectWebSocket();

  return () => {
    socket?.close();
    clearTimeout(reconnectTimeout);
    console.log("WebSocket closed");
  };
}, [lobbyCode]);

  const sendMessage = (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  return { ws, gameState, sendMessage };
};
