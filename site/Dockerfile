FROM archlinux:latest AS builder

# Установка зависимостей
RUN pacman -Syu --noconfirm \
    hugo \
    python \
    python-pip \
    git \
    curl

# Установка Pagefind с расширенной поддержкой
RUN pip install 'pagefind[extended]' --break-system-packages

WORKDIR /usr/src/app
COPY . .

# Команда сборки
CMD ["sh", "-c", "rm -rf public && hugo --minify --gc --ignoreCache && python -m pagefind  --site public --output-subdir _pagefind --verbose --force-language all && cp -r public/* /output"]
