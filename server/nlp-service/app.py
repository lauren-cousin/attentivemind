from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
from functools import lru_cache
import os
import pypdf
import textract
from docx import Document

app = Flask(__name__)
CORS(app, resources={r"/summarize": {"origins": "*"}})

# Helper function to handle different file types
def handle_file(file):
    text = ""
    if file.mimetype == 'text/plain':
        text = file.read().decode('utf-8')
    elif file.mimetype == 'application/pdf':
        reader = pypdf.PdfFileReader(file)
        text = ''.join([reader.getPage(i).extractText() for i in range(reader.numPages)])
    elif file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        doc = Document(file)
        text = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
    elif file.mimetype == 'application/msword':
        text = textract.process(file).decode('utf-8')
    else:
        raise ValueError('Unsupported file type')
    return text

@lru_cache()
def get_summarizer():
    # Load the summarization pipeline with the specified model and tokenizer
    # tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
    # tokenizer = AutoTokenizer.from_pretrained("sshleifer/distilbart-xsum-12-6")
    # model = AutoModelForSeq2SeqLM.from_pretrained("nlp-model-training/models/distilibar-xsum-12-6_longform-article-summ")
    # model = AutoModelForSeq2SeqLM.from_pretrained("nlp-model-training/models/bart-large-longform-article-summarization")
    # model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn", use_cache=True)
    tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
    model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")
    summarizer = pipeline("summarization", model=model, tokenizer=tokenizer)
    # summarizer = pipeline("summarization", model="facebook/bart-large-cnn", use_cache=True)
    return summarizer, tokenizer

@lru_cache()
def get_keyphrase_extractor():
    # Load the keyphrase extraction model
    # keyphrase_extractor = pipeline("token-classification", model="ml6team/keyphrase-extraction-kbir-inspec")
    keyphrase_extractor = pipeline("token-classification", model="ml6team/keyphrase-extraction-distilbert-openkp")
    # keyphrase_extractor = pipeline("token-classification", model="ml6team/keyphrase-extraction-distilbert-openkp", use_cache=True)
    return keyphrase_extractor

@lru_cache()
def get_flashcard_resources():    
    # Flashcard generation
    # generator = pipeline('text-generation', model='EleutherAI/gpt-neo-125m')
    # flashcard_tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
    # flashcard_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")
    flashcard_tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
    flashcard_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")
    return flashcard_model, flashcard_tokenizer

def chunk_text(input_text, chunk_size=500):
    _, tokenizer = get_summarizer()
    tokens = tokenizer.encode(input_text, return_tensors='pt', truncation=True, max_length=chunk_size, padding="max_length")
    chunks = [tokens[0, i:i + chunk_size] for i in range(0, tokens.size(1), chunk_size)]
    chunked_texts = [tokenizer.decode(chunk, skip_special_tokens=True, clean_up_tokenization_spaces=False) for chunk in chunks]
    return chunked_texts

def clean_and_capitalize(text):
    # Remove leading dash and space(s) and capitalize first letter
    if text.startswith("– "):
        text = text[2:].strip()
    if text:
        text = text[0].upper() + text[1:]
    return text

def calculate_summary_lengths(input_length):
    if input_length < 100:
        max_length = max(50, input_length // 2)
        min_length = max(20, input_length // 4)
    else:
        max_ratio = 0.7
        min_ratio = 0.1
        max_length =  int(input_length * max_ratio)
        min_length = max(100, int(input_length * min_ratio))
    return max_length, min_length

@app.route('/summarize', methods=['POST'])
def summarize_text():
    print("Received request with origin:", request.headers.get('Origin'))
    print("Headers:", request.headers)
    print("Files:", request.files)
    print("Form:", request.form)
    print("Data:", request.get_json())
    text_to_summarize = ""

    # Check if file is part of the request
    if 'file' in request.files and request.files['file'].filename:
        file = request.files['file']
        text_to_summarize = handle_file(file)
        if not text_to_summarize:
            return jsonify({'error': 'File is empty or text could not be extracted'}), 400
    
    # Check if text is part of the form data
    elif 'text' in request.form:
        text_to_summarize = request.form['text']
        if not text_to_summarize:
            return jsonify({'error': 'Text field is empty'}), 400
    
    elif request.is_json:
        # Handle JSON payloads
        data = request.get_json()
        text_to_summarize = data.get('text', '')
        if not text_to_summarize:
            return jsonify({'error': 'JSON text field is empty'}), 400

    else:
        return jsonify({'error': 'No file or text uploaded'}), 400

    
    print("Summarizing text:", text_to_summarize[:50])  # Print first 50 characters for debug

    chunked_texts = chunk_text(text_to_summarize)
    summaries = []
    input_length = len(text_to_summarize.split())
    max_length, min_length = calculate_summary_lengths(input_length)
    
    chunked_texts = chunk_text(text_to_summarize)
    summarizer, _ = get_summarizer()
    summaries = [summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)[0]['summary_text'] for text in chunked_texts]
    cleaned_summaries = [clean_and_capitalize(summary) for summary in summaries]
    
    # Return the summary as a JSON response
    combined_summary = ' '.join(cleaned_summaries)
    return jsonify({'summary': combined_summary})

@app.route('/extract-key-concepts', methods=['POST'])
def extract_key_concepts():
    data = request.get_json(force=True)
    summarized_text = data.get('text', '')

    if not summarized_text:
        return jsonify({'error': 'No text provided'}), 400

    keyphrase_extractor = get_keyphrase_extractor()

    # Perform keyphrase extraction
    keyphrases_predictions = keyphrase_extractor(summarized_text)
    
    # Initialize a variable to hold the reconstructed keyphrase
    reconstructed_keyphrase = ""
    keyphrases = []

    # Process each token in the prediction
    for prediction in keyphrases_predictions:
        token = prediction['word']
        score = prediction['score']  # Maybe use this later to filter more
        
        # Check if it is a subword that should be merged
        if token.startswith('##'):
            reconstructed_keyphrase += token[2:]  # Remove '##' and merge
        else:
            # If it's a new word, save the previous reconstructed keyphrase if it's long enough
            if reconstructed_keyphrase and len(reconstructed_keyphrase) > 2:
                keyphrases.append(reconstructed_keyphrase)
            reconstructed_keyphrase = token.replace('Ġ', ' ').strip()

    # Add the last keyphrase if it was missed
    if reconstructed_keyphrase and len(reconstructed_keyphrase) > 2:
        keyphrases.append(reconstructed_keyphrase)

    # Filter out duplicates
    unique_keyphrases = list(set(keyphrases))

    return jsonify({'keyphrases': unique_keyphrases})

@app.route('/generate-flashcards', methods=['POST'])
def generate_flashcards():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided for flashcard generation'}), 400

    flashcard_model, flashcard_tokenizer = get_flashcard_resources()

    num_flashcards_to_generate = 2  # Generate 2 Q&A pairs
    generated_questions = set()
    flashcards = []

    for _ in range(num_flashcards_to_generate):
        # Generate a question based on the text
        input_text = f"Please generate a question based on this text: {text}"
        input_ids = flashcard_tokenizer(input_text, return_tensors="pt").input_ids
        question_outputs = flashcard_model.generate(input_ids, max_length=100, num_beams=5, early_stopping=True, do_sample=True, temperature=0.8)
        question = flashcard_tokenizer.decode(question_outputs[0], skip_special_tokens=True)

        if question in generated_questions:
            continue  # Skip if same question already generated
        generated_questions.add(question)

        # Generate answer based on question and text
        input_text_for_answer = f"What is the answer to '{question}', based on this text: {text}"
        input_ids_for_answer = flashcard_tokenizer(input_text_for_answer, return_tensors="pt").input_ids
        answer_outputs = flashcard_model.generate(input_ids_for_answer, max_length=150, num_beams=5, early_stopping=True, do_sample=True, temperature=0.5)
        answer = flashcard_tokenizer.decode(answer_outputs[0], skip_special_tokens=True)

        # Add Q&A pair as new flashcard
        flashcards.append({'front': question, 'back': answer})

    return jsonify({'flashcards': flashcards})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    # Bind to PORT if defined, default to 5001 for local development.
    port = int(os.environ.get('PORT', 5001))
    app.run(host="0.0.0.0", port=port, debug=False)  # Set debug to False in production