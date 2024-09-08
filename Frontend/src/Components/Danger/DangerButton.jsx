import React from 'react';
import { useNavigate } from 'react-router-dom';

function DangerButton() {
  const navigate=useNavigate()
  const handleDangerClick = () => {
    navigate("/danger-form")
    
  };

  return (
    <button
      onClick={handleDangerClick}
      className="fixed bottom-20 right-10 z-50 rounded-full bg-red-600 px-6 py-3 text-white font-bold shadow-lg hover:bg-red-700 transition"
    >
      I am in danger
    </button>
  );
}

export default DangerButton;