FROM node:20 as BUILDER
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine as RUNNER
WORKDIR /usr/src/app
COPY --from=BUILDER /usr/src/app .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]