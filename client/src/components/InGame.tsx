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
    <div className="flex flex-col items-center min-h-screen bg-base-100 p-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
        Level: {gameState.level}
      </h1>
      <h2 className="text-xl sm:text-2xl font-medium text-secondary mb-4">
        Last Played Card: {gameState.lastPlayedCard}
      </h2>

      <div className="text-lg sm:text-xl text-accent font-semibold mb-4">
        Other Players' Cards:
      </div>

      {gameState.otherPlayersCards?.map(
        (cards: Array<number>, index: number) => (
          <div
            className="flex justify-center flex-wrap m-3 p-3 bg-neutral text-base-100 rounded-lg shadow-lg w-full sm:w-auto"
            key={index}
          >
            {cards.map((card: number, cardIndex: number) => (
              <button
                className="m-4 w-12 h-12 sm:w-16 sm:h-16 bg-secondary text-base-100 font-bold rounded-lg hover:bg-secondary-dark transition-all"
                key={cardIndex}
              >
                {card}
              </button>
            ))}
          </div>
        ),
      )}

      <div className="text-lg sm:text-xl text-accent font-semibold mb-4">
        Your Cards:
      </div>

      <div className="flex justify-center flex-wrap">
        {gameState.myCards?.map((number: number) => (
          <button
            onClick={() => handleClick(number)}
            className="m-4 w-12 h-12 sm:w-16 sm:h-16 bg-primary text-base-100 font-bold rounded-lg hover:bg-primary-dark transition-all"
            key={number}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}
