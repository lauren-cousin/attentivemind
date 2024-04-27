import React, { useState, useEffect } from 'react';
import FlashcardContainer from './FlashcardContainer';
import FlashcardSetModal from './FlashcardSetModal';
import { useSummary } from '../SummaryContext';

// Set config var for DigitalOcean or local
const attentiveMindServiceUrl = process.env.REACT_APP_ATTENTIVE_MIND_BACKEND_URL || 'http://localhost:3001' // Default to localhost for local development

function FlashcardGeneration() {
    const { generatedSummary } = useSummary();
    const [isSetModalOpen, setIsSetModalOpen] = useState(false);
    const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
    // const [highlightKeyConcepts, setHighlightKeyConcepts] = useState(false);
    // Initialize flashcardSet with empty title, description, and flashcards array
    const [flashcardSet, setFlashcardSet] = useState({
        title: '',
        description: '',
        flashcards: [],
    });

    useEffect(() => {
        const savedFlashcards = sessionStorage.getItem('flashcardSet');
        if (savedFlashcards) {
            setFlashcardSet(JSON.parse(savedFlashcards));
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem('flashcardSet', JSON.stringify(flashcardSet));
    }, [flashcardSet]);

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
        setIsGeneratingFlashcards(true);
        try {
            const response = await fetch(`${attentiveMindServiceUrl}/generate-flashcards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: generatedSummary
                }),
                mode: 'cors'
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
        } finally {
            setIsGeneratingFlashcards(false);
        }
    };

    const isSetCreated = flashcardSet.title || flashcardSet.description || flashcardSet.flashcards.length > 0;

    return (
        <div className="p-8">
            <h1 className="font-proximanova font-bold text-3xl mb-4">Flashcard Generation</h1>
            <div><p className="font-manrope font-light text-xl pb-4">Turn your notes, summaries, and key concepts into interactive flashcards. Our flashcard generation feature allows you to consolidate your summarized content into a powerful study aid.</p></div>

            <div className="flex items-baseline mb-4 space-x-4">
                <button onClick={handleOpenSetModal} className="btn btn-primary">{isSetCreated ? 'Edit Flashcard Set' : 'Create Flashcard Set'}</button>
                <button 
                    onClick={generateFlashcards} 
                    className={`btn btn-secondary mb-4 ${!generatedSummary ? 'btn-disabled' : ''}`}
                    disabled={!generatedSummary || isGeneratingFlashcards}>
                    Generate Flashcards
                    {isGeneratingFlashcards && (
                    <div className="flex justify-center items-center ml-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                    )}
                </button>
                {/* <button
                    className={`btn ${flashcardSet.flashcards.length > 0 ? 'btn-primary' : 'btn-disabled'}`}
                    onClick={() => setHighlightKeyConcepts(prev => !prev)}
                    disabled={flashcardSet.flashcards.length === 0}>
                    Highlight Key Concepts
                </button> */}
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