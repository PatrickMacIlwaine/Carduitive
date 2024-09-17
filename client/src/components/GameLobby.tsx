import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PreStartPage from "./PreStartPage";
import InGame from "./InGame";
import WinPage from "./WinPage";
import LossPage from "./LossPage";
import CountdownPage from "./CountDown";
import ErrorComponent from "./ErrorComponent";
import { v4 as uuidv4 } from "uuid";
import { useWebSocket } from "./hooks/useWebSocket";

export default function GameLobby() {
  const { lobbyCode } = useParams<{ lobbyCode: string }>();
  const clientId = uuidv4();
  const REACT_APP_WS = process.env.REACT_APP_WS_URL || "ws://localhost:8080";
  const navigate = useNavigate();

  const { ws, gameState, sendMessage, error } = useWebSocket(
    lobbyCode || '',
    clientId,
    REACT_APP_WS
  );

  if (!lobbyCode) {
    navigate("/");
    return <div>Invalid lobby code, redirecting...</div>;
  }

  if (error) {
    return (
      <ErrorComponent
      error={error}
    />)
  }

  if (gameState.loss) {
    return (
      <LossPage
        highScore={gameState.highScore}
        ws={ws}
        sendMessage={sendMessage}
        myCards={gameState.myCards}
        otherCards={gameState.otherPlayersCards}
        lastPlayedCard={gameState.lastPlayedCard}
      />
    );
  }

  if (gameState.win) {
    return (
      <WinPage
        highScore={gameState.highScore}
        ws={ws}
        sendMessage={sendMessage}
        cardHistory={gameState.playedCardsHistory}
      />
    );
  }

  if (gameState.countdown !== 0) {
    return <CountdownPage countdown={gameState.countdown} />;
  }

  if (gameState.inGame) {
    return <InGame gameState={gameState} ws={ws} sendMessage={sendMessage} />;
  }

  return (
    <PreStartPage
      gameState={gameState}
      ws={ws}
      sendMessage={sendMessage}
      lobbyCode={lobbyCode}
    />
  );
}
