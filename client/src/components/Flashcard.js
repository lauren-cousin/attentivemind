import React, { useState } from 'react';

const Flashcard = ({ frontContent, backContent }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Truncate text at 160 characters
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return `${text.substring(0, maxLength).trim()}...`;
        }
        return text;
    };

    return (
        <div
            className="relative w-64 h-40 bg-white shadow-md cursor-pointer flex justify-center items-center"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div
                className={`absolute w-full h-full p-4 transition-transform duration-500 ease-in-out flex justify-center items-center text-center ${isFlipped ? 'rotate-y-180' : ''}`}
            >
                <p className="break-words">
                    {!isFlipped ? truncateText(frontContent, 160) : truncateText(backContent, 160)}
                </p>
            </div>
        </div>
    );
};

export default Flashcard;