# AttentiveMind

## Accessing the Application
Visit the following URL to access the application: https://attentive-mind-uvxoy.ondigitalocean.app/.
You can also build and run a Dockerized version of the app locally by following the instructions below.

## Hosting
- Application is hosted through DigitalOcean.
- Hosting the NLP service is resource intensive. The minimum resource size for the NLP service that works reliably is: 
    - $50.00/mo
    - 4 GB RAM | 2 vCPUs | 250 GB bandwidth

## Local Build and Run
- Install [Docker](https://docs.docker.com/get-docker/)
- Ensure Docker has enough resources allocated (20 GB+ for Virtual Disk Limit)
- From root directory of project:
  - Run `docker-compose build`
  - Run `docker-compose up`
- Access application at http://localhost:3000
- Please note that the following two lines should be commented out in each of the Dockerfiles if doing a local build and the DigitalOcean application is no longer deployed:
  - `ENV REACT_APP_ATTENTIVE_MIND_BACKEND_URL https://attentive-mind-uvxoy.ondigitalocean.app/attentive-mind-web-service`
  - `ENV REACT_APP_ATTENTIVE_MIND_NLP_SERVICE_URL https://attentive-mind-uvxoy.ondigitalocean.app/attentive-mind-nlp-service`


## DigitalOcean Build and Run
### Rebuild and push Docker images to DigitalOcean
#### attentive-mind-client-service
```
docker build -t attentive-mind-client-service --platform linux/amd64 .
docker tag attentive-mind-client-service registry.digitalocean.com/attentive-mind/attentive-mind-client-service
docker push registry.digitalocean.com/attentive-mind/attentive-mind-client-service

```
#### attentive-mind-web-service
```
docker build -t attentive-mind-web-service --platform linux/amd64 .
docker tag attentive-mind-web-service registry.digitalocean.com/attentive-mind/attentive-mind-web-service
docker push registry.digitalocean.com/attentive-mind/attentive-mind-web-service
```
#### attentive-mind-nlp-service
```
docker build -t attentive-mind-nlp-service --platform linux/amd64 .
docker tag attentive-mind-nlp-service registry.digitalocean.com/attentive-mind/attentive-mind-nlp-service
docker push registry.digitalocean.com/attentive-mind/attentive-mind-nlp-service
```

## Training Model
- Adjust hyperparameters and selected model, then run `server/nlp-service/nlp-model-training/train_model.py` to train a new model

## Gathering Model Performance Metrics
- Run `server/nlp-service/nlp-model-training/run_performance_metrics.py` to generate performance metrics on summarization texts from various models.
- Manually add the summarized and reference texts to the file for comparison.

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

