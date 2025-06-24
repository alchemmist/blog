---
date: 2025-02-02
title: "Linux disk clean up"
tech_name: "linux-clean-up"
tags:
  - linux
extra:
  custom_props:
    time: 14:18
    public: true
    type: synopsis
    theme: linux
    status: writing
---
If you using docker on your machine, would be a good place for start it’s clean all docker stuff. Only if you’re sure in your docker containers, volumes nothing important:
```sh
docker system prune
```

## 1.  Clean packages
Next tips for Arch-base systems:

 Find heaviest packages. This command show top-20 most heavy packages:
```sh
pacman -Qi | awk '/^Name/{name=$3} /^Installed Size/{print $4 $5, name}' | sort -hr | head -n 20
```

Find unused dependencies:
```sh
pacman -Qdtq
```
**Pay attention**, in this list can be important packages for you, that are no one is using, it’s doesn’t mean this need to be remove.

If you’re sure, you can be remove all this list:
```sh
sudo pacman -Rns $(pacman -Qdtq)
```

Find forgotten packages. This command show top-20 long-unused packages:
```sh
expac --timefmt='%Y-%m-%d %T' '%l %n' | sort | head -n 20
```

Clean pacman cache. This command remove all old versions of packages, apart from last and current:
```sh
sudo paccache -r
```
This command remove all packages, apart from current installed:
```sh
sudo paccache -r -k 0
```
Keep in mind, after that you can be rollback to old package version without internet.

## 2. Clean files
This command show top-15 the heaviest directories at `home`:
```sh
du -h ~/ --max-depth=1 | sort -hr | head -n 15
```

This command show top-20 the heaviest directories at `home`:
```sh
find ~/ -type f -exec du -Sh {} + | sort -rh | head -n 20
```

I think that’s two command enough to do all clean up what you want. You can find heavies directory at home, than go here. Then again run command for this directory. Then go to heaviest, then find heavy files… 