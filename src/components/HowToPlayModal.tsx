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

        <div className="mt-4">
          <p className="text-gray-700">How to play has not been implemented yet lol, good luck!</p>
          {/* Add how to play instructions here */}
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
