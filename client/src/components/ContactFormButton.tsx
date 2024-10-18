import React, { useState } from "react";
import HowToPlayModal from "./HowToPlayModal";
import ContactForm from "./ContactForm";

export default function ContactFormButton(props: any) {
  const [displayStartModal, setDisplayStartModal] = useState(false);

  const handleClick = () => {
    setDisplayStartModal(!displayStartModal);
  };

  const handleCloseModal = () => {
    setDisplayStartModal(false);
  };

  return (
    <div className="p-4 fixed bottom-4 left-4">
      <button
        onClick={handleClick}
        className="w-20 h-20 bg-secondary text-base-100 text-xl font-semibold rounded-lg p-5 hover:bg-secondary-dark transition-all sm:w-20 sm:h-20 sm:text-xl sm:p-4"
      >
        <img src={'/contact.png'} />
      </button>

      {displayStartModal && <ContactForm onClose={handleCloseModal} />}
    </div>
  );
}
