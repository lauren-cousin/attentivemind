# AttentiveMind

## Accessing the Application
Visit the following URL to access the application: x
You can also build and run the app locally by following the instructions below.

## Local Build and Run
- Install [Docker](https://docs.docker.com/get-docker/)
- Ensure Docker has enough resources allocated (20 GB+ for Virtual Disk Limit)
- Run `docker-compose build` from root directory of project
- Run `docker-compose up`
- Access application at http://localhost:3000

## Training Model
- Adjust hyperparameters and selected model, then run `server/nlp-service/nlp-model-training/train_model.py` to train a new model

## Gathering Model Performance Metrics
- Run `server/nlp-service/nlp-model-training/run_performance_metrics.py` to generate performance metrics on summarization texts from various models.
- Manually add the summarized and reference texts to the file for comparison.

## Hosting
- Application is hosted through DigitalOcean.
- Hosting the NLP service is resource intensive. The minimum resource size for the NLP service that works reliably is: 
  - $150.00/mo – Pro
  - 8 GB RAM | 2 Dedicated vCPUs | 100 GB bandwidth

## Models
The LLMs currently in use in the application's NLP service are the following:

**Text Summarization:** 
- Base model is [facebook/bart-large-cnn](https://huggingface.co/facebook/bart-large-cnn)
- Tokenizer is [facebook/bart-large-cnn](https://huggingface.co/facebook/bart-large-cnn)
- Model has been custom trained against [vgoldberg/longform_article_summarization](https://huggingface.co/datasets/vgoldberg/longform_article_summarization) dataset

**Key Concept Extraction:**
- Base model is [ml6team/keyphrase-extraction-kbir-inspec](https://huggingface.co/ml6team/keyphrase-extraction-kbir-inspec)
- No custom training

**Flashcard Generation:**
- Base model is [google/flan-t5-base](https://huggingface.co/google/flan-t5-base)
- No custom training

