import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CreateLobbyOptions {
  playerCount: number;
  streamerMode: boolean;
  timeConstraint: boolean;
}

export const useCreateLobby = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createLobby = async ({
    playerCount,
    streamerMode,
    timeConstraint,
  }: CreateLobbyOptions) => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/create-lobby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerCount,
          streamerMode,
          timeConstraint,
        }),
      });

      const data = await response.json();

      if (data.lobbyCode) {
        navigate(`/game/${data.lobbyCode}`);
      }
    } catch (error) {
      console.error('Error creating lobby:', error);
    } finally {
      setLoading(false);
    }
  };

  return { createLobby, loading };
};