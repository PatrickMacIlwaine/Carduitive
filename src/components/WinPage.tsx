export default function WinPage(props: any) {
  const { cardHistory, highScore, ws, sendMessage, lobbyCode } = props;

  const handleClick = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      sendMessage(
        JSON.stringify({
          type: "nextRound",
          lobbyCode,
          win: true,
          loss: false,
        }),
      );
    } else {
      console.log('WebSocket is not open. Cannot send "ready" message.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-success text-base-100">
      <h1 className="text-8xl font-bold mb-8">You Win!</h1>
      <h2 className="text-3xl font-bold mb-8">Cards played: </h2>
      <div className="flex space-x-1 mb-6 p-4 bg-white rounded-lg">
        {cardHistory.map((card: number, index: number) => (
          <span key={index} className="text-2xl font-bold p-2">
            {card}
          </span>
        ))}
      </div>
      <button
        onClick={handleClick}
        className="bg-white text-base-100 text-lg font-semibold py-3 px-6 rounded-lg hover:bg-secondary transition-all"
      >
        Next Round
      </button>
      <h1 className="text-4xl font-medium mt-8">High Score: {highScore + 1}</h1>
    </div>
  );
}
