FROM node:20 as LOADER
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn

FROM node:20 as BUILDER
WORKDIR /usr/src/app
COPY --from=LOADER /usr/src/app .
COPY . .
RUN yarn run build

FROM node:20-alpine as RUNNER
WORKDIR /usr/src/app
COPY --from=BUILDER /usr/src/app .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["yarn", "start"]
