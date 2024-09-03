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

    const socket = new WebSocket(
      `${SERVER_URL}?lobbyCode=${lobbyCode}&clientId=${savedClientId}`,
    );

    socket.onopen = () => console.log("WebSocket connection established");
    socket.onerror = (error) => console.log("WebSocket error:", error);
    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      const message = JSON.parse(event.data);

      if (
        message.type === "lobbyUpdate" ||
        message.type === "fullStateUpdate"
      ) {
        console.log("Received lobby update:", message.payload);

        setGameState((prevState) => ({
          ...prevState,
          playersConnected:
            message.payload.playersConnected ?? prevState.playersConnected,
          playersReady: message.payload.playersReady ?? prevState.playersReady,
          playerCount: message.payload.playerCount ?? prevState.playerCount,
          level: message.payload.level ?? prevState.level,
          win: message.payload.win ?? prevState.win,
          loss: message.payload.loss ?? prevState.loss,
          myCards: message.payload.myCards ?? prevState.myCards,
          otherPlayersCards:
            message.payload.otherPlayersCards ?? prevState.otherPlayersCards,
          lastPlayedCard:
            message.payload.lastPlayedCard ?? prevState.lastPlayedCard,
          streamerMode: message.payload.streamerMode ?? prevState.streamerMode,
          timeConstraint:
            message.payload.timeConstraint ?? prevState.timeConstraint,
          playedCardsHistory:
            message.payload.playedCardsHistory ?? prevState.playedCardsHistory,
          highScore: message.payload.highScore ?? prevState.highScore,
          inGame: message.payload.inGame ?? prevState.inGame,
          countdown: message.payload.countdown ?? prevState.countdown,
        }));
      }
    };

    setWs(socket);

    return () => {
      socket.close();
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
