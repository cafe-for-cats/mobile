FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . ./ 

RUN npm install

EXPOSE 3000:3000

CMD ["yarn", "start"]
