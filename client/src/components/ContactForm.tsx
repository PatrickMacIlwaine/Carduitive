import React from "react";
import Backdrop from "./BackDrop";

interface HowToPlayModal {
  onClose: () => void;
}

export default function ContactForm({ onClose }: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Backdrop onExit={onClose} />
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold">Contact Developers</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          ></button>
        </div>

        <div className="m-4 p-2">
          <p className="mb-4">
            Feel free to request a feature or report a bug here:
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeqqJbEDIHip-Be5qlXbMhB055ZZ8fxwJLKFtdwKae6SHsCMQ/viewform?usp=sf_link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Google Form: Request a Feature or Report a Bug
          </a>
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
