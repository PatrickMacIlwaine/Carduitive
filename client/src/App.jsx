import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import './styles.css';
import GameLobby from './components/GameLobby';

function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="game/:lobbyCode" element={<GameLobby />} />
      </Routes>
    </div>
  ); 
}

export default App;