import React, { useState } from "react";
import StartNewGame from "./StartNewGameButton";
import HowToPlayButton from "./HowToPlayButton";

function HomePage() {
  const defaultSettings = {};
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <div className="flex flex-col items-center justify-center max-h-screen">
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-fail bg-secondary-dark tracking-widest leading-none">
        Carduitive
      </h1>
      <StartNewGame settings={settings} />
      <HowToPlayButton />
    </div>
  );
}
export default HomePage;
