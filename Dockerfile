# Use official Node.js Alpine base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package descriptors
COPY package.json ./

# Install production dependencies
RUN npm install --only=production

# Copy source code and static assets
COPY . .

# Expose default Google Cloud Run port
EXPOSE 8080

# Set environment variable defaults
ENV PORT=8080
ENV NODE_ENV=production
ENV SESSION_SECRET=opportunest_cloud_run_production_secret_2026

# Command to start application (triggers DB init and auto-seeding)
CMD ["npm", "start"]
