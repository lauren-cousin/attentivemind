import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SummaryProvider } from './SummaryContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import TextSummarization from './components/TextSummarization';
import NoteTaking from './components/NoteTaking';
import FlashcardGeneration from './components/FlashcardGeneration';
import Footer from './components/Footer';
import './App.css'

function App() {
  return (
    <Router>
      <SummaryProvider>
        <div className="flex flex-col min-h-screen px-4 sm:px-6 lg:px-8">
          <Header />
          <div className="flex-grow mt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/text-summarization" element={<TextSummarization />} />
              <Route path="/note-taking" element={<NoteTaking />} />
              <Route path="/flashcard-generation" element={<FlashcardGeneration />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </SummaryProvider>
    </Router>
  );
}

export default App;
