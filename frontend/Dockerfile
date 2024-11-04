FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tailwind.config.js ./
COPY .env.local ./

RUN npm install

COPY . .

CMD ["npm", "start"]
