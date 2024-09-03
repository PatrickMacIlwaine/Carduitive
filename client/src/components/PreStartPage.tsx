import React, { useState } from "react";

export default function PreStartPage(props: any) {
  const { ws, sendMessage, lobbyCode, clientId, gameState } = props;

  const [showReadyButton, setShowReadyButton] = useState<boolean>(true);
  const [showUserReady, setShowUserReady] = useState<boolean>();

  const handleReadyClick = () => {
    setShowReadyButton(false);
    setShowUserReady(true);

    if (ws && ws.readyState === WebSocket.OPEN) {
      sendMessage(
        JSON.stringify({
          type: "ready",
          lobbyCode,
          clientId,
        }),
      );
    } else {
      console.log('WebSocket is not open. Cannot send "ready" message.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Pre Start Page</h1>

      <div className="flex flex-col m-4">
        {!gameState.streamerMode && (
          <button
            className="w-80 h-16 bg-blue-300 rounded-md p-2 m-2"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          >
            Click to Copy game url: {window.location.href}
          </button>
        )}

        {gameState.streamerMode && (
          <button
            className="w-80 h-16 bg-blue-300 rounded-md p-2 m-2"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          >
            Click to Copy game url
          </button>
        )}

        <h2>Players connected: {gameState.playersConnected}</h2>
        <h2>
          Players ready: {gameState.playersReady} / {gameState.playerCount}
        </h2>

        {showReadyButton && (
          <button
            className="w-80 h-16 bg-blue-300 rounded-md p-2 m-2"
            onClick={handleReadyClick}
          >
            Ready
          </button>
        )}
        {showUserReady && <h2>Waiting for players to ready up</h2>}
      </div>
    </div>
  );
}
