# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License.

FROM node:dubnium

WORKDIR /usr/src/app

ARG VERSION

RUN git clone https://github.com/microsoft/openpaimarketplace.git && \
   cd openpaimarketplace && \
   git checkout ${VERSION} && \
   cd rest_server && \
   npm install

EXPOSE ${PORT}

WORKDIR /usr/src/app/openpaimarketplace/rest_server

CMD ["npm", "start"]
