FROM python:3.12.3
# ENV REACT_APP_ATTENTIVE_MIND_BACKEND_URL https://attentive-mind-uvxoy.ondigitalocean.app/attentive-mind-web-service
# ENV REACT_APP_ATTENTIVE_MIND_NLP_SERVICE_URL https://attentive-mind-uvxoy.ondigitalocean.app/attentive-mind-nlp-service

# Set working directory
WORKDIR /usr/src/app

# Copy current directory contents into container
COPY . .

# TODO: add back in later
# COPY nlp-model-training/saved_models /usr/src/app/nlp-model-training/saved_models

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Make port available outside this container
EXPOSE 5001

# Define environment variable
ENV NAME World

# Run app
CMD ["python", "app.py"]