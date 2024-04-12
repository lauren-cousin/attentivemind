import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrash, FaArrowsAltV } from 'react-icons/fa';

const FlashcardSetModal = ({ isOpen, onClose, onSaveSet, flashcardSet }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [localFlashcards, setLocalFlashcards] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setTitle(flashcardSet.title || '');
            setDescription(flashcardSet.description || '');
            setLocalFlashcards(flashcardSet.flashcards || []);
        }
    }, [isOpen, flashcardSet]);

    const onDragEnd = (result) => {
        const { destination, source } = result;
        
        // Do nothing if the item dropped outside list or dropped in same place
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }
    
        const newFlashcards = Array.from(localFlashcards);
        const [removed] = newFlashcards.splice(source.index, 1);
        newFlashcards.splice(destination.index, 0, removed);
    
        setLocalFlashcards(newFlashcards);
    };

    const addFlashcard = () => {
        const newFlashcard = {
            front: 'Front Content',
            back: 'Back Content',
            id: Date.now(),
        };
        setLocalFlashcards(prevFlashcards => [...prevFlashcards, newFlashcard]);
    };

    const updateFlashcard = (id, newFront, newBack) => {
        const updatedFlashcards = localFlashcards.map(flashcard => {
            if (flashcard.id === id) {
                return { ...flashcard, front: newFront, back: newBack };
            }
            return flashcard;
        });
        setLocalFlashcards(updatedFlashcards);
    };

    const deleteFlashcard = (id) => {
        setLocalFlashcards(localFlashcards.filter(flashcard => flashcard.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSaveSet({
            title,
            description,
            flashcards: localFlashcards,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-10">
            <div className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Flashcard Set</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-800">Flashcard Set Title:</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="px-4 py-2 border rounded-lg w-full" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-800">Flashcard Set Description:</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="px-4 py-2 border rounded-lg w-full" />
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="flashcards">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                   {localFlashcards.map((flashcard, index) => (
                                        <Draggable key={flashcard.id} draggableId={flashcard.id.toString()} index={index}>
                                            {(provided) => (
                                                <div 
                                                    ref={provided.innerRef} 
                                                    {...provided.draggableProps}
                                                    className="flex items-center mb-2"
                                                >
                                                    <div className="flex-grow">
                                                    <input 
                                                        type="text" 
                                                        value={flashcard.front} 
                                                        onChange={(e) => updateFlashcard(flashcard.id, e.target.value, flashcard.back)} 
                                                        className="px-4 py-2 border rounded-lg w-full mr-2" 
                                                    />
                                                    <input 
                                                        type="text" 
                                                        value={flashcard.back} 
                                                        onChange={(e) => updateFlashcard(flashcard.id, flashcard.front, e.target.value)} 
                                                        className="px-4 py-2 border rounded-lg w-full mr-2" 
                                                    />
                                                    </div>
                                                    <span {...provided.dragHandleProps}>
                                                        <FaArrowsAltV className="cursor-grab mr-2" />
                                                    </span>
                                                    <FaTrash 
                                                        className="text-red-500 cursor-pointer" 
                                                        onClick={() => deleteFlashcard(flashcard.id)}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <div className="flex justify-between items-center mt-4">
                        <button type="button" className="btn btn-primary" onClick={addFlashcard}>Add Flashcard</button>
                        <button type="submit" className="btn btn-success">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FlashcardSetModal;