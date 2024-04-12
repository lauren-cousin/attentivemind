from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM, AutoModelForTokenClassification
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app, resources={r"/summarize": {"origins": "*"}})

# Helper function to handle different file types
def handle_file(file):
    # TODO: Add additional libraries to handle PDF / DOCX files
    if file.mimetype == 'text/plain':
        return file.read().decode('utf-8')
    # TODO: Add additional conditions to handle other file types - ex: 'application/pdf' or 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    else:
        return 'Unsupported file type'

# Load the summarization pipeline with the specified model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
model = AutoModelForSeq2SeqLM.from_pretrained("nlp-model-training/saved_models/bart-large-arxiv")
# summarizer = pipeline("summarization", model=model, tokenizer=tokenizer)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
# Load the keyphrase extraction model
keyphrase_extractor = pipeline("token-classification", model="ml6team/keyphrase-extraction-kbir-inspec")
# keyphrase_extractor = pipeline("token-classification", model="ml6team/keyphrase-extraction-distilbert-openkp")
# Flashcard generation
# generator = pipeline('text-generation', model='EleutherAI/gpt-neo-125m')
flashcard_tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
flashcard_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

def chunk_text(input_text, chunk_size=1024):
    tokens = tokenizer.encode(input_text, return_tensors='pt', truncation=True, max_length=chunk_size, padding="max_length")
    chunks = [tokens[0, i:i + chunk_size] for i in range(0, tokens.size(1), chunk_size)]
    chunked_texts = [tokenizer.decode(chunk, skip_special_tokens=True, clean_up_tokenization_spaces=False) for chunk in chunks]
    return chunked_texts

@app.route('/summarize', methods=['POST'])
def summarize_text(min_ratio=0.1, max_ratio=0.7):
    print("Headers:", request.headers)
    print("Files:", request.files)
    print("Form:", request.form)
    print("Data:", request.get_json())
    text_to_summarize = ""
    if request.content_type.startswith('multipart/form-data'):
        file = request.files.get('file')
        print("hey")
        if file:
            text_to_summarize = handle_file(file)
        elif 'text' in request.form:
            text_to_summarize = request.form.get('text')
        else:
            return jsonify({'error': 'No text or file provided for summarization'}), 400
    elif 'text' in request.form:
        text_to_summarize = request.form['text']
        print("yo")

    # Handle JSON payloads
    elif request.is_json:
        data = request.get_json()
        text_to_summarize = data.get('text', '')
        print("aye")

    print("Text to summarize: ", text_to_summarize)
    if not text_to_summarize:
        return jsonify({'error': 'No text or file provided for summarization'}), 400
    
    print("Summarizing text:", text_to_summarize[:50])  # Print first 50 characters for debug

    chunked_texts = chunk_text(text_to_summarize)
    summaries = []
    input_length = len(text_to_summarize.split())
    max_length = int(input_length * max_ratio)
    min_length = int(input_length * min_ratio)
    max_length = max(500, max_length)
    min_length = max(100, min_length)
    
    chunked_texts = chunk_text(text_to_summarize)
    summaries = [summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)[0]['summary_text'] for text in chunked_texts]
    
    # Return the summary as a JSON response
    combined_summary = ' '.join(summaries)
    return jsonify({'summary': combined_summary})

@app.route('/extract-key-concepts', methods=['POST'])
def extract_key_concepts():
    data = request.get_json(force=True)
    summarized_text = data.get('text', '')

    if not summarized_text:
        return jsonify({'error': 'No text provided'}), 400

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

    return jsonify({'keyphrases': keyphrases})

@app.route('/generate-flashcards', methods=['POST'])
def generate_flashcards():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided for flashcard generation'}), 400

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

# if __name__ == '__main__':
#     app.run(debug=True, port=5001)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
