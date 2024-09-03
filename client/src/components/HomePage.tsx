import React, { useState } from "react";
import StartNewGame from "./StartNewGameButton";
import HowToPlayButton from "./HowToPlayButton";

function HomePage() {
  const defaultSettings = {};
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <div>
      <h1 className="text-5xl font-bold"> Carduitive </h1>
      <StartNewGame settings={settings} />
      <HowToPlayButton />
    </div>
  );
}
export default HomePage;
