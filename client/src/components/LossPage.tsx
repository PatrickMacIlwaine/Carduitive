export default function LossPage(props: any) {
  const { highScore, ws, sendMessage, lobbyCode } = props;

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
    <div>
      <h1>You Lose!</h1>
      <button onClick={handleClick}>Try Again</button>
      <h1> HighScore : {highScore}</h1>
    </div>
  );
}
