import React, { useRef, useState, useEffect } from 'react';
import { useSummary } from '../SummaryContext';

// Set config var for DigitalOcean or local
const attentiveMindServiceUrl = process.env.REACT_APP_ATTENTIVE_MIND_BACKEND_URL || 'http://localhost:3001' // Default to localhost for local development
const MIN_LENGTH = 100;
const MAX_LENGTH = 25000;

function TextSummarization() {
    const [inputText, setInputText] = useState('');
    const { generatedSummary, setGeneratedSummary, keyConcepts, setKeyConcepts } = useSummary();
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [isLoadingKeyConcepts, setIsLoadingKeyConcepts] = useState(false);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [validationMessage, setValidationMessage] = useState('');

    // Enable/Disable Summarize button
    const isSummarizable = inputText !== '' || file != null;

    useEffect(() => {
        // Reset input value when file is cleared
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [file]);
  
    const handleSubmit = async () => {
        if (!isSummarizable) return;

        if (!file) {
            if (inputText.length < MIN_LENGTH) {
                setValidationMessage(`Please enter at least ${MIN_LENGTH} characters.`);
                return;
            } else if (inputText.length > MAX_LENGTH) {
                setValidationMessage(`Please enter fewer than ${MAX_LENGTH} characters.`);
                return;
            } else {
                setValidationMessage('');
            }
        }

        setIsLoadingSummary(true);
        let headers = {};
        let body = null;

        if (file) {
            body = new FormData();
            body.append('file', file);
        } else {
            headers = { 'Content-Type': 'application/json; charset=UTF-8' };
        body = JSON.stringify({ text: inputText });
        }

        try {
            const response = await fetch(`${attentiveMindServiceUrl}/summarize`, {
                method: 'POST',
                headers: headers,
                body: body,
                mode: 'cors'
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                setValidationMessage(errorData.message || 'Error processing your request');
                setIsLoadingSummary(false);
                return; // Exit if response error
            }
    
            const data = await response.json();
            setGeneratedSummary(data.summary);
        } catch (error) {
            setValidationMessage('An unexpected error occurred.');
        } finally {
            setIsLoadingSummary(false);
            setFile(null);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setInputText('');
        setValidationMessage('');
    };

    const handleTextChange = (e) => {
        setInputText(e.target.value);
        setValidationMessage('');
    };

    const handleClearFile = () => {
        setFile(null);
        setInputText('');
        setFileInputKey(Date.now());
    };

    const handleExtractKeyConcepts = async () => {
        if (!generatedSummary) return; // Don't extract if no summary available
        setIsLoadingKeyConcepts(true);
    
        const response = await fetch(`${attentiveMindServiceUrl}/extract-key-concepts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ text: generatedSummary }),
            mode: 'cors'
        });
        const data = await response.json();
    
        console.log("Extracted key concepts: ", data.keyphrases); // Debugging line
    
        setKeyConcepts(data.keyphrases);
        setIsLoadingKeyConcepts(false);
    };
    
    return (
        <div className="flex flex-col px-8">
            <h1 className="font-proximanova font-bold text-3xl mb-4">Text Summarization & Key Concept Extraction</h1>
            <p className="font-manrope font-light text-xl">Transform your study sessions with our advanced Text Summarization and Key Concept Extraction tools. Effortlessly distill essential information from your lecture notes, meeting transcripts, or academic materials.</p>
            <div>
                {file && (
                    <div className="mb-4">
                        File uploaded: <span className="font-semibold">{file.name}</span>
                    </div>
                )}
                <textarea
                    className="textarea textarea-bordered w-full h-48 mb-4 mt-4 font-manrope"
                    placeholder="Enter text to summarize or upload a file below"
                    value={inputText}
                    onChange={handleTextChange}
                    disabled={!!file}
                ></textarea>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <input
                        key={fileInputKey}
                        type="file"
                        id="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".txt, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword"
                        ref={fileInputRef}
                    />
                    <label htmlFor="file" className="btn btn-primary">Upload File</label>
                    <button className={`btn font-manrope ${isSummarizable ? 'btn-primary' : 'btn-disabled'}`} onClick={handleSubmit} disabled={!isSummarizable}>Summarize</button>
                    <button className={`btn font-manrope ${file ? 'btn-error' : 'btn-disabled'}`} onClick={handleClearFile} disabled={!file}>Clear File</button>
                </div>
                <p className="text-sm mb-4 text-gray-600">Accepted file types: .txt, .pdf, .docx, .doc</p>
                    {validationMessage && (
                        <span className="text-red-500 text-sm ml-4">{validationMessage}</span>
                    )}
            </div>
            <h3>Generated Summary</h3>
            <div className="output font-manrope text-lg bg-gray-100 p-4 mb-4 text-gray-700"
                style={{ minHeight: '100px', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', border: '1px solid #ccc', borderRadius: '4px' }}>
                {isLoadingSummary ? (
                    <div class="flex justify-center items-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : generatedSummary}
            </div>
            <div className="mb-8">
                        <button
                            className={`btn font-manrope ${generatedSummary ? 'btn-primary' : 'btn-disabled'} mb-4`}
                            onClick={handleExtractKeyConcepts}
                            disabled={!generatedSummary}>
                            Extract Key Concepts
                        </button>

                    <h3>Key Concepts</h3>
                    <div className="key-concepts font-manrope text-lg bg-gray-100 p-4 text-gray-700" style={{ minHeight: '100px', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', border: '1px solid #ccc', borderRadius: '4px' }}>
                        {isLoadingKeyConcepts ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            keyConcepts.length > 0 ? (
                                <ul>
                                    {keyConcepts.map((kp, index) => (
                                        <li key={index}>{kp}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No key concepts found.</p>
                            )
                        )}
                    </div>
            </div>
        </div>
    );
}

export default TextSummarization;