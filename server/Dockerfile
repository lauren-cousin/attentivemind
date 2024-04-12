FROM node:latest

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