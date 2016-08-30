FROM node:6.2.2

WORKDIR /app
ADD . /app
RUN npm install
ADD . /app

EXPOSE 80

CMD node /app/.
