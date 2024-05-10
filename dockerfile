FROM node:21

# Install GraphicsMagick and Ghostscript
RUN apt-get update && apt-get install -y \
    graphicsmagick \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose port and start the app
EXPOSE 3000
CMD [ "node", "index.js" ]