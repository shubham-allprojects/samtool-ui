FROM node:18 AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /sam-tool-react
# Cache and Install dependencies
COPY package.json .
RUN npm install
# Copy app files
COPY . .
# Expose port
EXPOSE 3000
# Start the app
CMD [ "npm", "start" ]