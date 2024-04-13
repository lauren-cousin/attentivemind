const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Set config var to for Heroku
const attentiveMindServiceUrl = process.env.ATTENTIVE_MIND_SERVICE_URL || 'http://localhost:5001' // Default to localhost for local development

// Configure multer (for file uploads)
const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage: storage });

// Define a route to call the Python NLP service
router.post('/summarize', upload.single('file'), async (req, res) => {
    let text = '';

    try {
        if (req.file) {
            console.log("Received a file for summarization:", req.file.originalname);
            console.log("File type: " + req.file.mimetype);

            // Determine the file type and extract text accordingly
            if (req.file.mimetype === 'text/plain') {
                text = req.file.buffer.toString('utf8');
            } else if (req.file.mimetype === 'application/pdf') {
                const data = await pdfParse(req.file.buffer);
                text = data.text;
            } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || req.file.mimetype === 'application/msword') {
                const result = await mammoth.extractRawText({ buffer: req.file.buffer });
                text = result.value;
            } else {
                return res.status(400).send({ message: 'Unsupported file type' });
            }
        } else if (req.body.text) {
            console.log("Received text for summarization:", req.body.text);
            text = req.body.text;
        } else {
            return res.status(400).send({ message: 'No text or file provided for summarization' });
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text }),
        };

        const response = await fetch(`${attentiveMindServiceUrl}/summarize`, requestOptions);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

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
