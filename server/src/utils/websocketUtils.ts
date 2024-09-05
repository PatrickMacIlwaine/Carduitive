import { WebSocketServer, WebSocket } from "ws";
import {
  getLobby,
  addClientToLobby,
  updateReadyCount,
  sendCardsToClients,
  handlePlayCard,
  nextRound,
} from "../services/lobbyService";

export const createWebSocketServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws, req) => {
    const requestUrl = new URL(`http://${req.headers.host}${req.url ?? "/"}`);
    const lobbyCode = requestUrl.searchParams.get("lobbyCode");
    const clientId = requestUrl.searchParams.get("clientId");

    console.log(
      `New connection attempt. LobbyCode: ${lobbyCode}, ClientId: ${clientId}`,
    );

    if (!lobbyCode || !clientId) {
      console.log("Missing lobbyCode or clientId, closing connection.");
      ws.close(1008, "Lobby code and Client ID are required");
      return;
    }

    const lobby = getLobby(lobbyCode);
    if (!lobby) {
      ws.close(1008, "Invalid lobby code");
      return;
    }

    addClientToLobby(lobbyCode, ws, clientId);
    console.log(`Client ${clientId} connected to lobby ${lobbyCode}`);

    ws.on("message", (message: string) => {
      const parsedMessage = JSON.parse(message);

      switch (parsedMessage.type) {
        case "ready":
          updateReadyCount(lobbyCode, clientId);
          break;

        case "playCard":
          handlePlayCard(lobbyCode, clientId, parsedMessage.card);
          break;

        case "nextRound":
          nextRound(lobbyCode, parsedMessage.win, parsedMessage.loss);
          break;

        default:
          console.log(`Unknown message type received: ${parsedMessage.type}`);
      }

      console.log(`Received message from client ${clientId}: ${message}`);
    });

    ws.on("close", () => {
      console.log(`Client ${clientId} disconnected from lobby ${lobbyCode}`);

      const lobby = getLobby(lobbyCode);
      if (lobby) {
        lobby.clients.delete(clientId);
        lobby.playersConnected = lobby.clients.size;

        lobby.playersReady = [...lobby.playerReadyStatus.values()].filter(
          (ready) => ready,
        ).length;

        sendCardsToClients(lobbyCode);
      }
    });
  });
};
