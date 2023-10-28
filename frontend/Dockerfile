FROM node:20 as BUILDER
WORKDIR /usr/src/app

ARG NEXT_PUBLIC_PAIRING_API
ENV NEXT_PUBLIC_PAIRING_API=$NEXT_PUBLIC_PAIRING_API
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN yarn run build

FROM node:20-alpine as RUNNER
WORKDIR /usr/src/app
COPY --from=BUILDER /usr/src/app .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["yarn", "start"]
