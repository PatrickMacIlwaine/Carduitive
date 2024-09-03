import React, { useState, useEffect } from 'react';
import PreStartPage from './PreStartPage';
import CountDown from './CountDown';
import InGame from './InGame';
import WinPage from './WinPage';
import LossPage from './LossPage';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { useWebSocket } from './hooks/useWebSockets';

export default function GameLobby() {
  const [displayPreStartPage, setDisplayPreStartPage] = useState(true);
  const [displayCountDown, setDisplayCountDown] = useState(false);
  const [displayInGame, setDisplayInGame] = useState(false);
  const [displayWinPage, setDisplayWinPage] = useState(false);
  const [displayLossPage, setDisplayLossPage] = useState(false);

  const SERVER_URL = 'ws://localhost:8080';
  const { lobbyCode } = useParams();
  const clientId = uuidv4();

  const { ws, gameState, sendMessage } = useWebSocket(
    lobbyCode as string,
    clientId,
    SERVER_URL
  );

  useEffect(() => {
    if (gameState.loss) {
      setDisplayLossPage(true);
      setDisplayPreStartPage(false);
      setDisplayInGame(false);
      setDisplayWinPage(false);
    } else if (gameState.win) {
      setDisplayWinPage(true);
      setDisplayPreStartPage(false);
      setDisplayInGame(false);
      setDisplayLossPage(false);
    } else if (
      gameState.playersConnected > 0 &&
      gameState.playersReady === gameState.playerCount
    ) {
      setDisplayPreStartPage(false);
      setDisplayInGame(true);
    } else if (gameState.playersReady < gameState.playerCount) {
      setDisplayPreStartPage(true);
      setDisplayInGame(false);
      setDisplayWinPage(false);
      setDisplayLossPage(false);
    }
  }, [
    gameState.playersConnected,
    gameState.playersReady,
    gameState.loss,
    gameState.win,
    gameState.playerCount,
  ]);

  return (
    <div>
      {displayPreStartPage && !displayLossPage && !displayWinPage && (
        <PreStartPage
          gameState={gameState}
          ws={ws}
          sendMessage={sendMessage}
          lobbyCode={lobbyCode}
          clientId={clientId}
        />
      )}
      {displayCountDown && !displayLossPage && !displayWinPage && <CountDown />}
      {displayInGame && !displayLossPage && !displayWinPage && (
        <InGame
          gameState={gameState}
          sendMessage={sendMessage}
          ws={ws}
          lobbyCode={lobbyCode}
          clientId={clientId}
        />
      )}
      {displayWinPage && !displayLossPage && (
        <WinPage
          highScore={gameState.highScore}
          ws={ws}
          lobbyCode={lobbyCode}
          sendMessage={sendMessage}
        />
      )}
      {displayLossPage && !displayWinPage && (
        <LossPage
          highScore={gameState.highScore}
          ws={ws}
          lobbyCode={lobbyCode}
          sendMessage={sendMessage}
        />
      )}
    </div>
  );
}
