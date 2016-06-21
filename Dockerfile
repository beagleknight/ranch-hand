FROM node:4.3.1

WORKDIR /app
ADD . /app
RUN npm install
ADD . /app

CMD node /app/.
