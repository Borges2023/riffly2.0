FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY apps/api/package*.json ./
RUN npm install --production
COPY apps/api ./
COPY database /usr/database

EXPOSE 3001
CMD ["node", "./server.js"]
