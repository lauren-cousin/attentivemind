FROM python:3.12.3

# Set working directory
WORKDIR /usr/src/app

# Copy current directory contents into container
COPY . .

COPY nlp-model-training/saved_models /usr/src/app/nlp-model-training/saved_models

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Make port available outside this container
EXPOSE 5001

# Define environment variable
ENV NAME World

# Run app
CMD ["python", "app.py"]