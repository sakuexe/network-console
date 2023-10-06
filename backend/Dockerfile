FROM node:slim

WORKDIR /app/tllabra

COPY . .

RUN npm install

RUN npm run build

# Initialize and run the application
# Check package.json for the script
CMD ["npm", "run", "start"]
