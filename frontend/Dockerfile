FROM node:22.1.0 AS Production
LABEL authors="leopoldotodisco"

WORKDIR /app/frontend

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run start"]