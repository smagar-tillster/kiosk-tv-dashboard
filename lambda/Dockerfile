FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application code
COPY server.js ./
COPY newrelic-proxy.js ./

# Expose the port
EXPOSE 4000

# Set environment
ENV NODE_ENV=production

# Run the server
CMD ["node", "server.js"]
