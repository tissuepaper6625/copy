FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  libc6-compat \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev \
  pixman-dev

# Copy dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port if needed
EXPOSE 4002

# Start your app
CMD ["node", "app.js"]
