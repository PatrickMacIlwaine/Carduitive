import React, { useState } from "react";
import HowToPlayModal from "./HowToPlayModal";

export default function HowToPlayButton(props: any) {
  const [displayStartModal, setDisplayStartModal] = useState(false);

  const handleClick = () => {
    setDisplayStartModal(!displayStartModal);
  };

  const handleCloseModal = () => {
    setDisplayStartModal(false);
  };

  return (
    <div className="p-1 grid m-2">
      <button
        onClick={handleClick}
        className="w-48 h-16 bg-blue-300 rounded-md p-2"
      >
        How To Play
      </button>

      {displayStartModal && <HowToPlayModal onClose={handleCloseModal} />}
    </div>
  );
}
