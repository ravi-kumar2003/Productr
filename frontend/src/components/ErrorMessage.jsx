import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="bg-red-500 text-white p-4 rounded my-4 flex justify-between items-center">
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="bg-transparent border-none text-white text-2xl cursor-pointer p-0 ml-4 hover:opacity-80">
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
