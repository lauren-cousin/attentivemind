import React, { useState } from 'react';

const FlashcardModal = ({ isOpen, onClose, onAddFlashcard }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFlashcard({ front, back });
    setFront('');
    setBack('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-semibold text-gray-900">Add a Flashcard</h3>
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <label htmlFor="front" className="block text-sm font-semibold text-gray-800">Front:</label>
            <input type="text" id="front" value={front} onChange={(e) => setFront(e.target.value)} className="px-4 py-2 border rounded-lg w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="back" className="block text-sm font-semibold text-gray-800">Back:</label>
            <input type="text" id="back" value={back} onChange={(e) => setBack(e.target.value)} className="px-4 py-2 border rounded-lg w-full" />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 btn">Cancel</button>
            <button type="submit" className="btn btn-primary">Add Flashcard</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlashcardModal;