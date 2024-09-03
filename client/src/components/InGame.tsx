export default function InGame(props: any) {
  const { ws, sendMessage, lobbyCode, clientId, gameState } = props;

  const handleClick = (card: number) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      sendMessage(
        JSON.stringify({
          type: "playCard",
          clientId,
          card,
        }),
      );
    } else {
      console.log('WebSocket is not open. Cannot send "ready" message.');
    }
  };

  return (
    <div>
      <h1>Level: {gameState.level}</h1>
      <h1>Last Played Card: {gameState.lastPlayedCard}</h1>

      <div>Other Players' Cards:</div>

      {gameState.otherPlayersCards?.map(
        (cards: Array<number>, index: number) => (
          <div className="m-3 p-3" key={index}>
            {cards.map((card: number, cardIndex: number) => (
              <button className="m-4" key={cardIndex}>
                {card}
              </button>
            ))}
          </div>
        ),
      )}

      <div>Your Cards:</div>

      {gameState.myCards?.map((number: number) => (
        <button
          onClick={() => handleClick(number)}
          className="m-4"
          key={number}
        >
          {number}
        </button>
      ))}
    </div>
  );
}
