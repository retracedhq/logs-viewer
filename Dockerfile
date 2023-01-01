FROM node:16.18

WORKDIR /src

ADD package.json /src
ADD package-lock.json /src
RUN npm install --legacy-peer-deps

ADD . /src

EXPOSE 6012

CMD npm run start
