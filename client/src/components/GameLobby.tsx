import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PreStartPage from './PreStartPage';
import InGame from './InGame';
import WinPage from './WinPage';
import LossPage from './LossPage';
import CountdownPage from './CountDown';
import { v4 as uuidv4 } from 'uuid';
import { useWebSocket } from './hooks/useWebSocket';

export default function GameLobby() {
  const { lobbyCode } = useParams<{ lobbyCode: string }>();
  const clientId = uuidv4();
  const SERVER_URL = 'ws://localhost:8080';
  const navigate = useNavigate();

  const { ws, gameState, sendMessage } = useWebSocket(
    lobbyCode || '',
    clientId,
    SERVER_URL
  );

  if (!lobbyCode) {
    navigate('/');
    return <div>Invalid lobby code, redirecting...</div>;
  }

  if (gameState.loss) {
    return (
      <LossPage
        highScore={gameState.highScore}
        ws={ws}
        sendMessage={sendMessage}
      />
    );
  }

  if (gameState.win) {
    return (
      <WinPage
        highScore={gameState.highScore}
        ws={ws}
        sendMessage={sendMessage}
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
