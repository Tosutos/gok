FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production || npm install --production

COPY . .

# Cloud providers will inject PORT; default is 3001 for local
ENV PORT=3001
EXPOSE 3001

CMD ["node", "server.js"]

