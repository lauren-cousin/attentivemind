import React from 'react';
import Flashcard from './Flashcard';

const FlashcardContainer = ({ flashcards, onAddFlashcard }) => {
    return (
        <div className="p-4 space-y-4">
            <button
                className="w-64 h-40 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400"
                onClick={onAddFlashcard}
            >
                Add a Flashcard +
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {flashcards.map((flashcard) => (
                    <Flashcard key={flashcard.id} frontContent={flashcard.front} backContent={flashcard.back} />
                ))}
            </div>
        </div>
    );
};

export default FlashcardContainer;