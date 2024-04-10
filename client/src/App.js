import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SummaryProvider } from './SummaryContext';
import HomePage from './components/HomePage';
import TextSummarization from './components/TextSummarization';
import NoteTaking from './components/NoteTaking';
import FlashcardGeneration from './components/FlashcardGeneration';
import HamburgerMenu from './components/HamburgerMenu';
import './App.css'

function App() {
  return (
    <Router>
      <SummaryProvider>
        <div className="p-4">
          <HamburgerMenu />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/text-summarization" element={<TextSummarization />} />
            <Route path="/note-taking" element={<NoteTaking />} />
            <Route path="/flashcard-generation" element={<FlashcardGeneration />} />
          </Routes>
        </div>
      </SummaryProvider>
    </Router>
  );
}

export default App;
