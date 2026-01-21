# Multi-stage build for Esprit Livre Admin Frontend
# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Build arguments for environment variables
ARG VITE_API_URL=https://api.espritlivre.com
ARG VITE_AUTH_URL=https://auth.espritlivre.com

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

LABEL maintainer="oussamabenberkane.pro@gmail.com"
LABEL description="Esprit Livre Admin Frontend"

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
