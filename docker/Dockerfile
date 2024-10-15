FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN corepack enable
RUN yarn set version stable
RUN yarn config set nodeLinker node-modules
RUN yarn install

COPY .. .

EXPOSE 3000

CMD ["yarn", "dev"]
