##
 # Acuparse RTL Relay
 # @copyright Copyright (C) 2015-2021 Maxwell Power
 # @author Maxwell Power <max@acuparse.com>
 # @link http://www.acuparse.com
 # @license MIT
 #
 # Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the
 # Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 # and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 #
 # The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 #
 # THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 # MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
 # ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 # THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
##

##
 # File: Dockerfile
 # Acuparse RTL Relay Dockerfile
##

FROM node:current

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION
ARG APP_DIR='/opt/acuparse/'

LABEL MAINTAINER="docker@acuparse.com" \
org.label-schema.schema-version="1.0" \
org.label-schema.build-date=$BUILD_DATE \
org.label-schema.name="acuparse/rtl-relay" \
org.label-schema.version=$VERSION \
org.label-schema.description="Acuparse RTL Relay Server" \
org.label-schema.url="https://www.acuarse.com/" \
org.label-schema.vcs-url="https://gitlab.com/acuparse/rtl-relay" \
org.label-schema.vcs-ref=$VCS_REF \
org.label-schema.vendor="Acuparse"

COPY . "${APP_DIR}"
WORKDIR "${APP_DIR}"

RUN npm install

ENTRYPOINT ["npm"]
CMD ["start"]

EXPOSE 10514
EXPOSE 10514/udp
