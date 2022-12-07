FROM node:8

WORKDIR /src

ADD package.json /src
ADD yarn.lock /src
RUN yarn

ADD . /src

EXPOSE 6012

CMD yarn run start
