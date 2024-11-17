FROM node:20-alpine

WORKDIR /app/user-project

COPY yarn.lock package.json ./

RUN yarn install 

COPY . .

RUN yarn build

CMD [ "yarn", "start:prod" ]