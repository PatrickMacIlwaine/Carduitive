import React, { createContext, useContext, useState } from 'react';

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

const GameStateContext = createContext<{
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
} | null>(null);

export const GameStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
