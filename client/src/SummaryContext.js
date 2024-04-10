import React, { createContext, useState, useContext } from 'react';

const SummaryContext = createContext();

export function useSummary() {
  return useContext(SummaryContext);
}

export const SummaryProvider = ({ children }) => {
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [keyConcepts, setKeyConcepts] = useState([]);

  return (
    <SummaryContext.Provider value={{ generatedSummary, setGeneratedSummary, keyConcepts, setKeyConcepts }}>
      {children}
    </SummaryContext.Provider>
  );
};