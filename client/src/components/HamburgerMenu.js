import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    let navigate = useNavigate();
  
    return (
      <div>
        <button className="btn btn-square btn-ghost" onClick={() => setIsOpen(!isOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 bg-gray-200 shadow-md mt-2 py-2 w-48 z-50">
            <button onClick={() => {navigate('/'); setIsOpen(false);}} className="btn btn-ghost w-full justify-start text-black">Home</button>
            <button onClick={() => {navigate('/text-summarization'); setIsOpen(false);}} className="btn btn-ghost w-full justify-start text-black">Text Summarization</button>
            <button onClick={() => {navigate('/note-taking'); setIsOpen(false);}} className="btn btn-ghost w-full justify-start text-black">Note Taking</button>
            <button onClick={() => {navigate('/flashcard-generation'); setIsOpen(false);}} className="btn btn-ghost w-full justify-start text-black">Flashcard Generation</button>
          </div>
        )}
      </div>
    );
  }  

export default HamburgerMenu;
