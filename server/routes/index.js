const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const multer = require('multer');
const textract = require('textract');

console.log('REACT_APP_ATTENTIVE_MIND_BACKEND_URL:', process.env.REACT_APP_ATTENTIVE_MIND_BACKEND_URL);
console.log('REACT_APP_ATTENTIVE_MIND_NLP_SERVICE_URL:', process.env.REACT_APP_ATTENTIVE_MIND_NLP_SERVICE_URL);
const attentiveMindServiceUrl = process.env.REACT_APP_ATTENTIVE_MIND_NLP_SERVICE_URL || 'http://attentivemind-nlp-service-1:5001' || 'http://localhost:5001' // Default to localhost for local development

const MIN_LENGTH = 100;
const MAX_LENGTH = 25000;

const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage: storage });

router.post('/summarize', upload.single('file'), (req, res) => {
    if (req.file) {
        console.log("Received a file for summarization:", req.file.originalname);
        console.log("File type:", req.file.mimetype);

        new Promise((resolve, reject) => {
            textract.fromBufferWithName(req.file.originalname, req.file.buffer, (error, text) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(text);
                }
            });
        }).then(text => {
            if (text.length < MIN_LENGTH || text.length > MAX_LENGTH) {
                throw new Error(`Text must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters.`);
            }
            return fetch(`${attentiveMindServiceUrl}/summarize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text }),
            });
        }).then(response => response.json())
          .then(data => res.json(data))
          .catch(error => {
            console.error('Error:', error.message);
            res.status(500).json({ message: error.message, error: error.message });
        });
    } else if (req.body.text) {
        console.log("Received text for summarization:", req.body.text);
        handleTextSummarization(req.body.text, res);
    } else {
        res.status(400).send({ message: 'No text or file provided for summarization' });
    }
});

function handleTextSummarization(text, res) {
    if (text.length < MIN_LENGTH || text.length > MAX_LENGTH) {
        return res.status(400).send({
            message: `Text must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters.`,
        });
    }
    fetch(`${attentiveMindServiceUrl}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text }),
    })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
        console.error('Error:', error.message);
        res.status(500).json({ message: error.message, error: error.message });
    });
}

router.post('/extract-key-concepts', async (req, res) => {
    try {
        const summarizedText = req.body.text;

        if (!summarizedText) {
            return res.status(400).send({ message: 'No summarized text provided for key concept extraction' });
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: summarizedText }),
        };

        const response = await fetch(`${attentiveMindServiceUrl}/extract-key-concepts`, requestOptions);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.post('/generate-flashcards', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).send({ message: 'No text provided for flashcard generation' });
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text }),
        };

        const response = await fetch(`${attentiveMindServiceUrl}/generate-flashcards`, requestOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error forwarding request to Flask app:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
