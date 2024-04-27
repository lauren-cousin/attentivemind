FROM node:latest
# ENV REACT_APP_ATTENTIVE_MIND_BACKEND_URL https://attentive-mind-uvxoy.ondigitalocean.app/attentive-mind-web-service
# ENV REACT_APP_ATTENTIVE_MIND_NLP_SERVICE_URL https://attentive-mind-uvxoy.ondigitalocean.app/attentive-mind-nlp-service

# Set working directory
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    poppler-utils \
    antiword && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install packages
RUN npm install

# Bundle app source
COPY . .

# Make port available outside this container
EXPOSE 3001

# Run app
CMD ["node", "app.js"]