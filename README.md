<h2><img src="./site/static/assets/logo.svg" alt="Favicon Preview" width="75" align="center"> Blog</h2>

[![Github](https://img.shields.io/badge/alchemmist%2Fblog-blue?logo=github&label=github&color=blue)](https://github.com/alchemmist/blog)
[![Deploy](https://github.com/alchemmist/blog/actions/workflows/deploy.yaml/badge.svg?branch=main)](https://github.com/alchemmist/blog/actions/workflows/deploy.yaml)
![Last commit](https://img.shields.io/github/last-commit/alchemmist/blog?style=flat) 
![License](https://img.shields.io/github/license/alchemmist/blog?style=flat)
![Contributors](https://img.shields.io/github/contributors/alchemmist/blog?style=flat)
[![Blog](https://img.shields.io/badge/alchemmist.xyz-red?style=flat&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAAAmJLR0QA/4ePzL8AAAAHdElNRQfpCBkNDSaPhdvdAAACo0lEQVQ4y53VX2iVdRgH8I/nnE2nW6fNjnNMatgitiAUMc2ifzQqnJBgCCbtItdNdhF1IWiIVxFdSESQBBEYxRpdSBcGBbWIMmgKwSmtobOpHW3OrbENPTvn14Vnp/dsew/k97153ufh+zy/3/N83+clHo16tbhFPG5S77x0ddHXxAJKh3Ulq0G99khkiy+9WJ282zFd4Haky/47veMBM9UP+6RJI17zkM8EWfeV/G8KfrCyOjntlCCYUhAEv3pbr7eMm9UD7vVC5EQV2GlMKD3FshUEWRlJu/zuonsghad0+9hPWOolhzS66pRB5/yj1hqbPKwRQYfn7FFrv7NztV4VnLfHFh+5YcYRGytGUutRA4KCccGUQ5b+F2xyRFHehGDaK5KLXKbNt4Jg1PPz48sdNCMI3peKaeRmOcE30apzqHFUMGZT7BQSjgoGLF8okryTGHI6llw0iJVWLCSzBldMV1HAVaxyB6iTsWLuhsusR2oRuVYWanJQ1l3WajGc0m61jMdsQKvb/B1LbkbSThCMO5vytdXlDrbpNBBb936M+lTOhBHnDKf84YoLRrXqUm+H74RFyW0exG/2RftSLy2JBn2CXOyw3hAE097zhMzC8FbXBcdL/axEl1z5A5nVf1O+UT21SOFph73ucsS/xFaHNbvmmJy7dRiWr8zdKVvOPWCbRgkJaZu9a0xw3ctulmuaL9F6nwvO2+tDecG0n/Xpc8K1UsLLOuNm2G3WqO2o80HFCggmXVAQ9Feswwge8WNpydAtr2DQcZcEf9pmrQMmBSdtXIycjGylZxV9r1XSDjd8pQYJuwwJ+qMtnjMLJsq+jCW+cBGnTWmwTF7RJ37RI6uoKvYasQG0+8sZzf4HVllXWjVpJwzd+v/qGT1q4oL/ArGV39EThJYTAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI1LTA4LTI1VDEzOjEzOjMyKzAwOjAw870+1wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNS0wOC0yNVQxMzoxMzozMiswMDowMILghmsAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjUtMDgtMjVUMTM6MTM6MzgrMDA6MDBxhfj6AAAAAElFTkSuQmCC&logoColor=violet&label=blog&labelColor=white&color=grey)](https://alchemmist.xyz?utm_source=github)

This repository contains the sources of my blog: [alchemmist.xyz](https://alchemmist.xyz?utm_source=github). On my blog I have this features:
- Aesthetic minimalistic typography.
- Search (_with [pagefind](https://pagefind.app/)_).
- Comments (_with [remark42](https://remark42.com/)_).
- Easter eggs (_try to find it_).
- Share buttons .
- Updates log.
- Support of [NerdFonts icons](https://www.nerdfonts.com/cheat-sheet).
- Easy to use icons with [iconify](https://iconify.design/) and partials.
- Multilanguages texts.
- Totally custom design.
- Hotkeys. See help with pressing `?`.
- Code syntax hilighting with GitHub ligth [theme](https://gohugo.io/quick-reference/syntax-highlighting-styles/#github).
- Analytics platform of trafic (_with [umami](https://umami.is/)_)

You are welcome to forking it for you personal blogs or contributing here. In this case it will be great if you put link to my blog `:)`. Or you can contribute here, report and fix bugs, sugest and implement new improvments. In order to do that, you need [Hugo](https://gohugo.io/) and [Pagefind](https://pagefind.app/), just for running locally:
```sh
make dev
```
After that on `localhost:1313` will up my blog.

If you want to up all infrostruture, please, use docker compose:
```sh
docker compose up -d
```
But befor it, you need to feel the gaps in compose.yaml with secrets, that you will use.


