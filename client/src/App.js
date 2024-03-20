import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import TextSummarization from './components/TextSummarization';
import NoteTaking from './components/NoteTaking';
import FlashcardGeneration from './components/FlashcardGeneration';
import HamburgerMenu from './components/HamburgerMenu';
import './App.css'

function NavigationButtons() {
  let navigate = useNavigate(); // Hook for navigation
  return (
    <div className="flex flex-col space-y-2 p-4">
      <button onClick={() => navigate('/')} className="btn">Home</button>
      <button onClick={() => navigate('/text-summarization')} className="btn">Text Summarization</button>
      <button onClick={() => navigate('/note-taking')} className="btn">Note Taking</button>
      <button onClick={() => navigate('/flashcard-generation')} className="btn">Flashcard Generation</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="p-4">
        <HamburgerMenu />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/text-summarization" element={<TextSummarization />} />
          <Route path="/note-taking" element={<NoteTaking />} />
          <Route path="/flashcard-generation" element={<FlashcardGeneration />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
