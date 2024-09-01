
export default function WinPage(props: any) {

  const { highScore, ws, sendMessage, lobbyCode } = props;

  const handleClick = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      sendMessage(
        JSON.stringify({
          type: 'nextRound',
          lobbyCode,
          win: true,
          loss:false,
        })
      );
    } else {
      console.log('WebSocket is not open. Cannot send "ready" message.');
    }
  };
        
  return (
    <div>
      <h1>You Win!</h1>
      <button onClick={handleClick}>NextRound</button>
      <h1> HighScore : {highScore}</h1>
    </div>
  );
}
