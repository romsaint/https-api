FROM node:20-alpine

WORKDIR /app/project

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

CMD [ "yarn", "start:prod" ]