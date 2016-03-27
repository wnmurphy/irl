FROM ubuntu:latest
​
RUN apt-get update -q
​
RUN apt-get install -yqq wget aptitude htop vim git traceroute dnsutils curl pkg-config ssh sudo tree tcpdump nano psmisc gcc make build-essential libfreetype6 libfontconfig libkrb5-dev
​
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
​
RUN sudo apt-get install -yq nodejs
​
# Cache package.json
​
ADD package.json /tmp/package.json
​
RUN cd /tmp && npm install
​
# Bundle app source
COPY . /src
WORKDIR /src
​
# Install app dependencies
RUN cp -a /tmp/node_modules /src/
​
EXPOSE 8080
CMD ["node", "server/server.js"]
