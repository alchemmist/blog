#!/usr/bin/env bash
# Exercise the production nginx config behind a TLS-terminating reverse proxy.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
fixture="$(mktemp -d)"
container=""
cleanup() {
  if [[ -n "$container" ]]; then docker rm -f "$container" >/dev/null; fi
  rm -rf "$fixture"
}
trap cleanup EXIT
for path in articles books ru/poetry cv essays updates teach; do
  mkdir -p "$fixture/$path"
  printf 'ok\n' > "$fixture/$path/index.html"
done
# nginx in the container does not run as the host user. A 0700 temp dir
# is readable on Docker Desktop and returns 404 on a Linux runner.
chmod -R a+rX "$fixture"
container="$(docker run -d -p 127.0.0.1::8080 \
  -v "$root/site/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
  -v "$fixture:/usr/share/nginx/html:ro" nginx:1.27-alpine)"
port="$(docker port "$container" 8080/tcp | head -1 | sed 's/.*://')"
for attempt in {1..30}; do
  if curl -fsS "http://127.0.0.1:$port/articles/" >/dev/null 2>&1; then break; fi
  sleep 0.2
done
for path in articles books ru/poetry cv essays updates teach; do
  headers="$(curl -fsS -D - -o /dev/null -H 'Host: alchemmist.xyz' \
    -H 'X-Forwarded-Proto: https' "http://127.0.0.1:$port/$path?test=1" | tr -d '\r')"
  grep -q '^HTTP/1.1 301 ' <<< "$headers"
  grep -qi "^Location: /$path/?test=1$" <<< "$headers"
  curl -fsS "http://127.0.0.1:$port/$path/" >/dev/null
done
headers="$(curl -sS -D - -o /dev/null -H 'Host: alchemmist.xyz' \
  "http://127.0.0.1:$port/cv/ru/short/" | tr -d '\r')"
grep -q '^HTTP/1.1 302 ' <<< "$headers"
grep -qi '^Location: https://alchemmist.github.io/CV/pdf/short-rus.pdf$' <<< "$headers"
printf 'Nginx section redirects preserve public origin (no HTTP/8080 leakage)\n'
printf 'CV resume paths redirect to GitHub Pages PDFs\n'
