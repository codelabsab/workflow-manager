FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock prisma/ ./

RUN yarn install
RUN yarn postinstall

