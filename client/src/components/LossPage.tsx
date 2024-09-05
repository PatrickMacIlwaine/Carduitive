export default function LossPage(props: any) {
  const {
    lastPlayedCard,
    myCards,
    otherCards,
    highScore,
    ws,
    sendMessage,
    lobbyCode,
  } = props;

  const allCards: Array<number> = myCards
    .concat(...otherCards)
    .concat(lastPlayedCard)
    .sort((a: number, b: number) => a - b);

  const handleClick = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      sendMessage(
        JSON.stringify({
          type: "nextRound",
          lobbyCode,
          win: false,
          loss: true,
        }),
      );
    } else {
      console.log('WebSocket is not open. Cannot send "ready" message.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-error text-base-100">
      <h1 className=" text-center text-8xl font-bold mb-8 ">You Lose!</h1>
      <h2 className="text-3xl font-bold mb-8">Cards: </h2>
      <div className="flex flex-wrap space-x-1 mb-6 p-4 bg-white rounded-lg max-w-full overflow-auto">
        {allCards.map((card: number, index: number) => (
          <span
            key={index}
            className={`text-2xl font-bold p-2 ${
              card === lastPlayedCard ? " text-error" : "text-black"
            } rounded-lg`}
          >
            {card}
          </span>
        ))}
      </div>
      <button
        onClick={handleClick}
        className="bg-white text-base-100 text-lg font-semibold py-3 px-6 rounded-lg hover:bg-success transition-all"
      >
        Try Again
      </button>
      <h1 className="text-4xl font-medium mt-8">High Score: {highScore}</h1>
    </div>
  );
}
