all: dev

.PHONY: content-demo

content-demo:
	HUGO_BUILD_WRITESTATS=false hugo server --source site --buildDrafts --disableFastRender --noBuildLock --bind 127.0.0.1 --port 1314

dev:
	 cd site && \
	 rm -rf public && \
	 hugo --minify && \
	 pagefind --site public --output-subdir _pagefind --verbose --force-language all && \
	 hugo serve


