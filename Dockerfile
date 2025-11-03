FROM node:20-alpine

# Install OpenSSL and libssl for Prisma
RUN apk add --no-cache openssl openssl-dev

WORKDIR /app

# Install dependencies only when needed
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy app source
COPY . .

# Make init script executable
RUN chmod +x scripts/init.sh || true

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Run init script and start the app
CMD sh -c "sh scripts/init.sh && npm run dev"

