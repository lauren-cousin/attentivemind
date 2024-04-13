import React, { useState } from 'react';
import FlashcardContainer from './FlashcardContainer';
import FlashcardSetModal from './FlashcardSetModal';
import { useSummary } from '../SummaryContext';

// Set config var to for Heroku
const attentiveMindServiceUrl = process.env.ATTENTIVE_MIND_BACKEND_URL || 'http://localhost:3001' // Default to localhost for local development

function FlashcardGeneration() {
    const { generatedSummary } = useSummary();
    const [isSetModalOpen, setIsSetModalOpen] = useState(false);
    // Initialize flashcardSet with empty title, description, and flashcards array
    const [flashcardSet, setFlashcardSet] = useState({
        title: '',
        description: '',
        flashcards: [],
    });

    const handleOpenSetModal = () => setIsSetModalOpen(true);
    const handleCloseSetModal = () => setIsSetModalOpen(false);

    const handleSaveSet = (updatedSet) => {
        // Update flashcardSet with new data from the modal
        setFlashcardSet(updatedSet);
        handleCloseSetModal();
    };

    const handleAddFlashcardDirectly = () => {
        const newFlashcard = {
            id: Date.now() + Math.random().toString(), // setting date as unique id with random string
            front: 'Front Content',
            back: 'Back Content',
        };
    
        // Update flashcardSet state with new flashcard
        setFlashcardSet(prevSet => ({
            ...prevSet,
            flashcards: [...prevSet.flashcards, newFlashcard]
        }));
    };

    const generateFlashcards = async () => {
        try {
            const response = await fetch(`${attentiveMindServiceUrl}/generate-flashcards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: generatedSummary
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            const generatedFlashcards = data.flashcards;
    
            const flashcardsWithIds = generatedFlashcards.map(flashcard => ({
                ...flashcard,
                id: Date.now() + Math.random().toString(),
            }));
    
            setFlashcardSet(prevSet => ({
                ...prevSet,
                flashcards: [...prevSet.flashcards, ...flashcardsWithIds]
            }));
        } catch (error) {
            console.error("Failed to generate flashcards:", error);
        }
    };

    const isSetCreated = flashcardSet.title || flashcardSet.description || flashcardSet.flashcards.length > 0;

    return (
        <div className="p-4">
            <h1 className="font-merriweather font-normal text-5xl mb-4">AttentiveMind</h1>
            <p className="font-manrope font-light text-2xl pb-4">Create flashcards based on your notes, generated summary, and key concepts.</p>

            <div className="flex items-baseline mb-4 space-x-4">
                <button onClick={handleOpenSetModal} className="btn btn-primary">{isSetCreated ? 'Edit Flashcard Set' : 'Create Flashcard Set'}</button>
                <button 
                    onClick={generateFlashcards} 
                    className={`btn btn-secondary mb-4 ${!generatedSummary ? 'btn-disabled' : ''}`}
                    disabled={!generatedSummary}>
                    Generate Flashcards
                </button>
            </div>
            {/* Set Title and Description */}
            {isSetCreated && (
            <div className="mb-8 pt-8">
                <h2 className="text-3xl font-bold">{flashcardSet.title || 'Your Flashcard Set'}</h2>
                <p className="text-xl mt-2">{flashcardSet.description || 'Description of your flashcard set.'}</p>
            </div>
            )}

            <FlashcardContainer flashcards={flashcardSet.flashcards} onAddFlashcard={handleAddFlashcardDirectly} />
            <FlashcardSetModal 
                isOpen={isSetModalOpen} 
                onClose={handleCloseSetModal} 
                onSaveSet={handleSaveSet} 
                flashcardSet={flashcardSet}
            />
        </div>
    );
}

export default FlashcardGeneration;