#!/usr/bin/env python3
"""Check the rendered Follow block, not just icon assets or template source.

Usage: python3 scripts/check-follow-icons.py [public-directory | homepage.html]
"""

import argparse
from html.parser import HTMLParser
from pathlib import Path
import sys


EXPECTED = {
    "rss", "telegram", "github", "bluesky", "linkedin", "twitter",
    "habr", "medium", "reddit", "leetcode",
}
VOID_ELEMENTS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}


class FollowParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.entries = []
        self.blocks = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = set(attrs.get("class", "").split())
        in_follow = self.stack[-1][1] if self.stack else False
        entry = self.stack[-1][2] if self.stack else None
        if "follow-options-container" in classes:
            self.blocks += 1
            in_follow = True
        if in_follow and "subscribe-banner" in classes:
            entry = {"names": classes & EXPECTED, "svgs": 0}
            self.entries.append(entry)
        if entry is not None and tag == "svg":
            entry["svgs"] += 1
        if tag not in VOID_ELEMENTS:
            self.stack.append((tag, in_follow, entry))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID_ELEMENTS:
            self.handle_endtag(tag)


def check(path):
    parser = FollowParser()
    parser.feed(path.read_text(encoding="utf-8"))
    errors = []
    if parser.blocks != 1:
        errors.append(f"expected one Follow block, found {parser.blocks}")
    if len(parser.entries) != len(EXPECTED):
        errors.append(f"expected {len(EXPECTED)} Follow entries, found {len(parser.entries)}")
    for name in sorted(EXPECTED):
        entries = [entry for entry in parser.entries if name in entry["names"]]
        if len(entries) != 1:
            errors.append(f"{name}: expected one entry, found {len(entries)}")
        elif entries[0]["svgs"] != 1:
            errors.append(f"{name}: expected one inline SVG, found {entries[0]['svgs']}")
    if errors:
        raise ValueError("; ".join(errors))
    print(f"{path}: all {len(EXPECTED)} Follow entries contain inline SVG icons")


def main():
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument("path", nargs="?", type=Path, default=Path("site/public"))
    path = args.parse_args().path
    if path.is_dir():
        # Both language homepages render the Follow block.
        paths = [path / "index.html"]
        if (path / "ru/index.html").is_file():
            paths.append(path / "ru/index.html")
    else:
        paths = [path]
    try:
        for homepage in paths:
            check(homepage)
    except (OSError, ValueError) as error:
        print(f"Follow icon check failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
