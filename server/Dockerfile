FROM node:latest
# ENV REACT_APP_ATTENTIVE_MIND_BACKEND_URL https://attentive-mind-web-service-6105166eb5e0.herokuapp.com
# ENV REACT_APP_ATTENTIVE_MIND_NLP_SERVICE_URL https://attentive-mind-nlp-service-389bc03ef0b8.herokuapp.com

# Set working directory
WORKDIR /usr/src/app

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