FROM node:latest
# ENV REACT_APP_ATTENTIVE_MIND_BACKEND_URL https://attentive-mind-uvxoy.ondigitalocean.app/attentive-mind-web-service
# ENV REACT_APP_ATTENTIVE_MIND_NLP_SERVICE_URL https://attentive-mind-uvxoy.ondigitalocean.app/attentive-mind-nlp-service

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy client directory contents into container
COPY . ./

# Build app
RUN npm run build

# Install serve to serve build directory
RUN npm install -g serve

# Serve build directory
CMD ["serve", "-s", "build"]

# Expose port
EXPOSE 3000