FROM node:18.15.0-alpine AS backend-builder
WORKDIR /app
COPY ./backend .
RUN npm install
RUN npm run clean
RUN npm run build

FROM node:18.15.0-alpine AS frontend-builder
WORKDIR /app
COPY ./frontend .
RUN npm install
RUN npm run clean
RUN npm run build

FROM node:18.15.0-alpine AS prod
WORKDIR /app
COPY --from=backend-builder ./app/dist ./dist
COPY --from=frontend-builder ./app/dist ./dist/public
COPY ./backend/package* ./
RUN npm install --omit=dev
CMD npm start