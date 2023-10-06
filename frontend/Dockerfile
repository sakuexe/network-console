FROM node:slim

WORKDIR /app/tllabra

# Copy everything, .dockerignore is respected
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# RUN apt update && apt install -y curl

# Run the application
CMD ["node", "./dist/server/entry.mjs"]
# CMD ["sleep", "5", "curl", "http://backend:5000"]
