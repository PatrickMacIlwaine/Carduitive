import React, { useState } from "react";
import StartNewGameModal from "./StartNewGameModal";

export default function StartNewGame(props: any) {
  const [displayStartModal, setDisplayStartModal] = useState(false);

  const handleClick = () => {
    setDisplayStartModal(!displayStartModal);
  };

  const handleCloseModal = () => {
    setDisplayStartModal(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={handleClick}
        className="w-full sm:w-64 h-16 sm:h-20 bg-secondary text-base-100 text-lg sm:text-xl font-semibold rounded-lg p-4 hover:bg-secondary-dark transition-all"
      >
        Start New Game
      </button>
      {displayStartModal && <StartNewGameModal onClose={handleCloseModal} />}
    </div>
  );
}
