FROM node:8-alpine

WORKDIR /app
COPY . /app

RUN apk add --no-cache --virtual build-dependencies python make git g++ && \
    rm -fr node_modules && \
    npm install && \
    chown -R node:node . && \
    npm cache clean --force && \
    apk del build-dependencies

USER node

CMD ["npm","start"]
