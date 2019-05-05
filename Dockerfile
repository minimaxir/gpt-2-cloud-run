FROM phusion/baseimage:0.11

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

RUN apt-get -y update && \ 
    apt-get -y install python3-dev python3-pip locales && \
    locale-gen en_US.UTF-8

RUN pip3 install --upgrade pip
RUN pip3 --no-cache-dir install tensorflow gpt-2-simple starlette uvicorn ujson

COPY checkpoint /
COPY app.py /

# Support UTF-8 input
ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENTRYPOINT ["/sbin/my_init", "--", "python3", "app.py"]
