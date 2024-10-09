import React from "react";
import Backdrop from "./BackDrop";

interface HowToPlayModal {
  onClose: () => void;
}

export default function HowToPlayModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Backdrop onExit={onClose} />
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold">How To Play</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          ></button>
        </div>

        <div className="m-4 p-2">
          <ul >
            <p>
              Objective: Work together to play numbered cards in ascending order
              without talking. Each player gets 1 card in Level 1, 2 cards in
              Level 2, and so on, increasing each level.
            </p>
            <p>
              Gameplay: No talking! Players can’t communicate verbally or show
              their cards. Players take turns playing cards from their hand in
              ascending order (smallest number first). If a player plays a card
              out of order (lower cards still in other players’ hands), the
              round ends and everyone loses.
            </p>
            <p>
              Winning: Clear all levels successfully by playing all cards in
              order.
            </p>
            <p>
              Each player gets 1 card in Level 1, 2 cards in Level 2, and so on,
              increasing each level.
            </p>
          </ul>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
