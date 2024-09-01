import React, { useState, useEffect } from 'react';
import PreStartPage from './PreStartPage';
import CountDown from './CountDown';
import InGame from './InGame';
import WinPage from './WinPage';
import LossPage from './LossPage';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';

export default function GameLobby() {
  const [displayPreStartPage, setDisplayPreStartPage] = useState(true);
  const [displayCountDown, setDisplayCountDown] = useState(false);
  const [displayInGame, setDisplayInGame] = useState(false);
  const [displayWinPage, setDisplayWinPage] = useState(false);
  const [displayLossPage, setDisplayLossPage] = useState(false);

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
  }

  const [gameState, setGameState] = useState<GameState>({
    playersConnected: 0,
    playersReady: 0,
    playerCount: 99,
    level: 1,
    win: false,
    loss: false,
    myCards: [1, 2, 3],
    otherPlayersCards: [],
    lastPlayedCard: 0,
    streamerMode: false,
    timeConstraint: false,
    playedCardsHistory: [],
    highScore: 1,
  });

  const SERVER_URL = 'ws://localhost:8080';
  const [clientId, setClientId] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { lobbyCode } = useParams();

  useEffect(() => {
    if (!lobbyCode) return;

    const savedClientId = localStorage.getItem('clientId') || uuidv4();
    localStorage.setItem('clientId', savedClientId);
    setClientId(savedClientId);

    const socket = new WebSocket(
      `${SERVER_URL}?lobbyCode=${lobbyCode}&clientId=${savedClientId}`
    );

    socket.onopen = () => console.log('WebSocket connection established');
    socket.onerror = (error) => console.log('WebSocket error:', error);
    socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      const message = JSON.parse(event.data);

      if (message.type === 'lobbyUpdate' || 'fullStateUpdate') {
        console.log('Received lobby update:', message.payload);

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
        }));
      }
    };

    setWs(socket);

    return () => {
      socket.close();
      console.log('WebSocket closed');
    };
  }, [lobbyCode]);

  const sendMessage = (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

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
        <WinPage highScore={ gameState.highScore } ws={ws} lobbyCode={lobbyCode} sendMessage={sendMessage} />
      )}
      {displayLossPage && !displayWinPage && (
        <LossPage highScore={ gameState.highScore } ws={ws} lobbyCode={lobbyCode} sendMessage={sendMessage} />
      )}
    </div>
  );
}
