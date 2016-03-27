FROM centos:centos6

RUN yum install -y epel-release
RUN yum install -y nodejs npm

# Cache package.json

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production


# Bundle app source
COPY . /src
WORKDIR /src

# Install app dependencies
RUN cp -a /tmp/node_modules /src/

EXPOSE 8080
CMD ["node", "server/server.js"]