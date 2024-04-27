import React, { useState } from 'react';

const Flashcard = ({ frontContent, backContent, highlightKeyConcepts, keyConcepts }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Truncate text at 160 characters
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return `${text.substring(0, maxLength).trim()}...`;
        }
        return text;
    };

    const highlightText = (text) => {
        if (!highlightKeyConcepts || !keyConcepts.length) return text;

        const regex = new RegExp(`(${keyConcepts.join('|')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };

    const prepareContent = (content) => {
        const highlighted = highlightText(content);
        return truncateText(highlighted, 160);
    };


    return (
        <div
            className="relative w-64 h-40 bg-white shadow-md cursor-pointer flex justify-center items-center"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div
                className={`absolute w-full h-full p-4 transition-transform duration-500 ease-in-out flex justify-center items-center text-center ${isFlipped ? 'rotate-y-180' : ''}`}
                dangerouslySetInnerHTML={{ __html: isFlipped ? prepareContent(backContent) : prepareContent(frontContent) }}
            >
            </div>
        </div>
    );
};

export default Flashcard;