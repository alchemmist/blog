FROM golang:1.27-bookworm AS builder

ARG HUGO_VERSION=0.167.0
ARG TARGETARCH

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-venv ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

RUN architecture="${TARGETARCH:-$(dpkg --print-architecture)}" \
    && archive="hugo_${HUGO_VERSION}_linux-${architecture}.tar.gz" \
    && curl -fsSL -o "/tmp/${archive}" "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${archive}" \
    && curl -fsSL -o /tmp/hugo_checksums.txt "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_checksums.txt" \
    && cd /tmp \
    && grep " ${archive}$" hugo_checksums.txt | sha256sum --check \
    && tar -xzf "${archive}" -C /usr/local/bin hugo \
    && rm "${archive}" hugo_checksums.txt

RUN python3 -m venv /opt/pagefind \
    && /opt/pagefind/bin/pip install --no-cache-dir 'pagefind[extended]'

ENV PATH="/opt/pagefind/bin:${PATH}"

WORKDIR /usr/src/app
COPY . .

CMD ["sh", "-c", "rm -rf public && hugo --minify --gc --ignoreCache && python -m pagefind --site public --output-subdir _pagefind --verbose --force-language all && rm -rf /output/* && cp -r public/* /output"]
