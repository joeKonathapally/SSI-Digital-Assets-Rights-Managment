FROM bcgovimages/von-image:py36-1.15-1

RUN pip3 install aries-cloudagent

RUN pip3 install python3-indy

ADD ./temp-actors/ ./

ENTRYPOINT ["/bin/bash", "-c", "aca-py \"$@\"", "--"]