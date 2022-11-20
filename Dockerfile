FROM node:16

WORKDIR /usr/src/app

COPY ./backend/package*.json ./
RUN yarn install

COPY ./backend ./
COPY ./frontend/build ../frontend/build

EXPOSE 9000
CMD [ "node", "./bin/www" ]
