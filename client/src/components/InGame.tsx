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

      <div className="w-full flex justify-center">
        <div className="flex flex-wrap justify-center w-full max-w-screen-lg">
          {gameState.otherPlayersCards?.map(
            (cards: Array<number>, playerIndex: number) => (
              <div
                key={playerIndex}
                className="flex flex-col items-center justify-center w-auto"
              >
                <div className="flex justify-center flex-wrap m-3">
                  {cards.map((card: number, cardIndex: number) => (
                    <button
                      className="m-1 w-8 h-12 sm:w-8 sm:h-12 bg-secondary text-base-100 font-bold rounded-lg hover:bg-secondary-dark transition-all"
                      key={cardIndex}
                    >
                      ?
                    </button>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="text-lg sm:text-xl text-accent font-semibold mb-4">
        Your Cards:
      </div>

      <div className="flex justify-center flex-wrap">
        {gameState.myCards?.map((number: number) => (
          <button
            onClick={() => handleClick(number)}
            className="m-3 w-28 h-20 sm:w-24 sm:h-20 sm:text-4xl md:w-52 md:text-6xl lg:text:6xl bg-primary text-base-100 text-4xl font-bold rounded-lg hover:bg-secondary-dark transition-all"
            key={number}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}
