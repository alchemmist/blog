# /// script
# dependencies = [
#   "fonttools",
#   "brotli"
# ]
# ///

from fontTools.ttLib import TTFont
import os
import sys

TARGET_CODEPOINT = 0x007E

def process(path):
    font = TTFont(path)
    if "cmap" not in font:
        return
    for table in font["cmap"].tables:
        if table.isUnicode() and TARGET_CODEPOINT in table.cmap:
            del table.cmap[TARGET_CODEPOINT]
    font.save(path)

def main():
    directory = sys.argv[1] if len(sys.argv) > 1 else "."
    for name in os.listdir(directory):
        if name.endswith(".woff2") and "typewriter" in name:
            process(os.path.join(directory, name))

if __name__ == "__main__":
    main()
