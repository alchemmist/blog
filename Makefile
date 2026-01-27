all: dev

dev:
	 cd site && \
	 rm -rf public && \
	 hugo --minify && \
	 pagefind --site public --output-subdir _pagefind --verbose --force-language all && \
	 hugo serve


