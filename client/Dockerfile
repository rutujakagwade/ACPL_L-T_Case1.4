# Use a node image with enough tools for expo
FROM node:22.19.0

# Work directory inside container
WORKDIR /app

# Install expo CLI globally
RUN npm install -g expo-cli @expo/ngrok

# Copy package.json and lock file first for caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose Metro bundler and devtools ports
EXPOSE 19000 19001 19002 8081

# Environment vars (optional)
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Run expo in tunnel mode
CMD ["npx", "expo", "start", "--tunnel"]