import React from 'react';
import { FaRegNewspaper, FaPencilAlt, FaRegListAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  let navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="font-merriweather font-normal text-5xl mb-4">Welcome to AttentiveMind</h1>
      <p className="font-manrope font-light text-2xl">Your comprehensive study tool.</p>
      
      <div className="flex justify-around items-center mt-10">
        {/* Text Summarization & Key Concept Extraction Button */}
        <div className="text-center">
          <button onClick={() => navigate('/text-summarization')} className="flex flex-col items-center justify-center">
            <FaRegNewspaper className="text-4xl mb-2" />
            <span>Text Summarization & Key Concept Extraction</span>
          </button>
        </div>

        {/* Note-Taking Button */}
        <div className="text-center">
          <button onClick={() => navigate('/note-taking')} className="flex flex-col items-center justify-center">
            <FaPencilAlt className="text-4xl mb-2" />
            <span>Note-Taking</span>
          </button>
        </div>

        {/* Flashcard Generation Button */}
        <div className="text-center">
          <button onClick={() => navigate('/flashcard-generation')} className="flex flex-col items-center justify-center">
            <FaRegListAlt className="text-4xl mb-2" />
            <span>Flashcard Generation</span>
          </button>
        </div>
      </div>
    </div>
  )
};

export default HomePage;