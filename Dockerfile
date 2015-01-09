FROM amatas/nodejs
MAINTAINER Alfredo Matas "amatas@gmail.com"

RUN yum -y update && \
    yum -y install git wget && \
    yum -y clean all && \
    npm -g install kanso && \
    useradd -d /universal gpii && \
    wget https://raw.githubusercontent.com/avtar/ansible-costing/master/playbooks/files/modify_preferences.sh -O /usr/local/bin/modify_preferences.sh && \
    chmod a+x /usr/local/bin/modify_preferences.sh

COPY . /universal
COPY docker/run /usr/local/bin/run

RUN chmod +x /usr/local/bin/run && \
    cd /universal && \
    npm install

EXPOSE 8082

CMD ["/usr/local/bin/run"]
