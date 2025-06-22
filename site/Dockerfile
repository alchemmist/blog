FROM archlinux:latest

WORKDIR /usr/src/app

RUN pacman --noconfirm -Syu hugo

COPY . .

CMD ["hugo", "serve", "--bind", "0.0.0.0", "--baseURL", "https://alchemmist.xyz", "--port", "1313"]
