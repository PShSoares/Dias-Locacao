FROM node:22-alpine

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
