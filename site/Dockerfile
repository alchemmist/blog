FROM archlinux:latest

WORKDIR /usr/src/app

RUN pacman -Syu hugo

COPY . .

CMD ["hugo", "serve"]
