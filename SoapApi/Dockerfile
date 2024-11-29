FROM node:16
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src
RUN npm install
EXPOSE 4000
CMD ["npx", "ts-node", "src/app.ts"]
