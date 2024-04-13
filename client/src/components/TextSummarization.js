import React, { useRef, useState, useEffect } from 'react';
import { useSummary } from '../SummaryContext';

const attentiveMindServiceUrl = process.env.REACT_APP_ATTENTIVE_MIND_BACKEND_URL || 'http://localhost:3001' // Default to localhost for local development

function TextSummarization() {
    const [inputText, setInputText] = useState('');
    const { generatedSummary, setGeneratedSummary, keyConcepts, setKeyConcepts } = useSummary();
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [isLoadingKeyConcepts, setIsLoadingKeyConcepts] = useState(false);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    // Enable/Disable Summarize button
    const isSummarizable = inputText !== '' || file != null;

    useEffect(() => {
        // Reset input value when file is cleared
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [file]);
  
    const handleSubmit = async () => {
        if (!isSummarizable) return; // Prevent submission if not ready
        setIsLoadingSummary(true);
        let headers = {};
        let body = null;

        if (file) {
            let formData = new FormData();
            formData.append('file', file);
            body = formData;
            // For FormData, 'Content-Type' header is auto-set with correct boundary
        } else {
            // For direct text, send JSON data
            headers = { 'Content-Type': 'application/json' };
            body = JSON.stringify({ text: inputText });
        }
    
        const response = await fetch(`${attentiveMindServiceUrl}/summarize`, {
            method: 'POST',
            headers: headers,
            body: body,
        });
        const data = await response.json();
        console.log(data);
        setGeneratedSummary(data.summary);
        setIsLoadingSummary(false);
        setFile(null); // Reset file input after processing
    };

      const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setInputText(''); // Clear text area when file selected
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: generatedSummary }),
        });
        const data = await response.json();
    
        if (data.keyphrases) {
            setKeyConcepts(data.keyphrases);
        }
        setIsLoadingKeyConcepts(false);
    };
    
    return (
    <>
        <div className="text-manrope p-4">
            <h1 className="font-merriweather font-normal text-5xl mb-4">AttentiveMind</h1>
            <p className="font-manrope font-light text-2xl">Summarize your lecture notes, transcripts, or course materials.</p>
        </div>
        <div className="p-4">
            <h2 className="font-manrope font-bold text-3xl mb-4">Text Summarization</h2>
            {file && (
                <div className="mb-4">
                    File uploaded: <span className="font-semibold">{file.name}</span>
                </div>
            )}
            <textarea
                className="textarea textarea-bordered w-full h-48 mb-4 font-manrope"
                placeholder="Enter text to summarize or upload a file below"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={!!file}
            ></textarea>
            <div className="flex items-center justify-start gap-4 mb-4">
                <input
                    key={fileInputKey}
                    type="file"
                    id="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".txt,.pdf,.docx,.doc"
                    ref={fileInputRef}
                />
                <label htmlFor="file" className="btn btn-primary">Upload File</label>
                <button className={`btn font-manrope ${isSummarizable ? 'btn-primary' : 'btn-disabled'}`} onClick={handleSubmit} disabled={!isSummarizable}>Summarize</button>
                <button className={`btn font-manrope ${file ? 'btn-error' : 'btn-disabled'}`} onClick={handleClearFile} disabled={!file}>Clear File</button>
            </div>
        <h3>Generated Summary</h3>
        <div className="output font-manrope text-lg bg-gray-100 p-4 mb-4"
            style={{ minHeight: '100px', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', border: '1px solid #ccc', borderRadius: '4px' }}>
            {isLoadingSummary ? (
                <div class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : generatedSummary}
        </div>
        <div className="mb-8">
                    <button
                        className={`btn font-manrope ${generatedSummary ? 'btn-primary' : 'btn-disabled'}`}
                        onClick={handleExtractKeyConcepts}
                        disabled={!generatedSummary}>
                        Extract Key Concepts
                    </button>
                </div>

                <h3>Key Concepts</h3>
                <div className="key-concepts font-manrope text-lg bg-gray-100 p-4" style={{ minHeight: '100px', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', border: '1px solid #ccc', borderRadius: '4px' }}>
                    {isLoadingKeyConcepts ? (
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <ul>
                            {/* Filter duplicates */}
                            {Array.from(new Set(keyConcepts.map(kp => kp.toLowerCase())))
                                .map(kp => kp.charAt(0).toUpperCase() + kp.slice(1))
                                .map((kp, index) => (
                                    <li key={index}>{kp}</li>
                            ))}
                        </ul>
                    )}
                </div>
    </div>
    </>
    );
}

export default TextSummarization;