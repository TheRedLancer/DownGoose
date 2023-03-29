FROM node:alpine
    WORKDIR /usr/yourapplication-name
    COPY package.json .
    RUN npm install
    COPY . .
    RUN tsc
    EXPOSE 3000
    EXPOSE 8000
    CMD ["node", "./dist/server.js"]