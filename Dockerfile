FROM node:16

WORKDIR /usr/src/app

COPY ./backend .

RUN yarn install
COPY ./frontend/build ./frontend/build

EXPOSE 9000
CMD [ "node", "./bin/www" ]
