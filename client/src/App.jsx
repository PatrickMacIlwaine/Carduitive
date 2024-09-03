import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import './styles.css';
import GameLobby from './components/GameLobby';
import { GameStateProvider } from './components/hooks/GameStateContext';


function App() {
  return (
    <div>
      <GameStateProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="game/:lobbyCode" element={<GameLobby />} />
        </Routes>
      </GameStateProvider>
    </div>
  ); 
}

export default App;
