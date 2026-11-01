# Issue #75: homepage browser investigation

Investigated **2026-11-01**, against the deployed `https://alchemmist.xyz/` homepage. Source baseline was `4da5d25`; the live main bundle was `main.min.e05b31f8fa57adad18fe10ad613eb4bea4810ad5523a100ed5c64ab7b5c716da.js`. This was a read-only source investigation; no Hugo build was run and the user's `site/hugo_stats.json` was not touched.

## Method and measured results

Used an isolated **Google Chrome 156.0.8078.74**, headless on macOS, with a temporary profile and Chrome DevTools Protocol (CDP), not an HTTP-only check. Enabled Network, Runtime and Log capture; installed PerformanceObservers before navigation for paint-related metrics, long tasks, layout shifts and events. Disabled browser cache and navigated from `about:blank` for each run. The three normal runs shared the browser/network connections, so they are cache-disabled navigations, not three fully cold browser launches. Observed each normal run for 12 seconds.

| Run | TTFB | DOMContentLoaded end | FCP / LCP | Load event end | Long tasks >50ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| Normal 1 | 262ms | 588ms | 724ms | 2054ms | 0 |
| Normal 2 | 105ms | 325ms | 372ms | 777ms | 0 |
| Normal 3 | 154ms | 633ms | 540ms | 2156ms | 0 |
| Throttled | 422ms | 2383ms | 2124ms | 9454ms | 0 |

The throttled run used CDP 4x CPU slowdown, 150ms network latency, 200,000 bytes/s download and 93,750 bytes/s upload, with a 20-second observation window. This is synthetic throttling, not a real mobile device measurement. No console exceptions or failed resource requests appeared during these four ordinary-storage runs. Search input initialization completed in every run.

**No actual homepage freeze was reproduced in ordinary browsing conditions.** The throttled page painted well before `load`; a long loading indicator is not evidence of a blocked main thread.

## Concrete findings

### 1. A large unnecessary homepage font transfer

The homepage fetched `/hugo-content/fonts/SymbolsNerdFont-Regular.woff2`: **965,180 decoded bytes / 965,480 transfer bytes**. It was by far the largest resource (roughly four-fifths of the measured page transfer). Its request took 429–1591ms in normal runs, and **7328ms** under throttling (started at 2097ms, completed around 9425ms). The throttled load event followed at 9454ms.

Source evidence:

- `site/assets/style.css` puts `"NerdFontsSymbols Nerd Font"` first in the universal `*` font-family rule, including homepage text.
- The pinned `github.com/alchemmist/hugo-content v0.1.1` defines this font face without `unicode-range` in `assets/hugo-content/fonts.css`.
- Homepage social icons are already inline SVG, so this nearly 1MB font is not needed for those icons.
- Courier regular and bold also transferred about 43KB each; a Computer Modern font added another 86KB after load.

**Minimal recommendation:** prevent the symbol font from being considered for ordinary homepage text. Prefer an appropriately restricted `unicode-range` in the shared font definition, or scope symbol-font use to content that actually needs it. Check the site's real Nerd Font glyph repertoire before choosing ranges; do not blindly remove font support from article/code/poetry content. Merely making another preload would not solve this cost. Re-measure transfer and `load` after the change; the present evidence establishes resource cost, not that it caused the user's reported freeze.

### 2. Storage denial reproducibly disables enhancement UI

A separate browser run injected throwing `Storage.prototype.getItem` and `setItem` implementations before page scripts (a deliberate simulation of storage denied by browser policy). Against the live pre-fix bundle:

- Both Umami and `main.js` threw uncaught `SecurityError` exceptions.
- The main exception originated at the top-level `localStorage.getItem("burgerAngle")` (live minified bundle column 432).
- The document still reached `readyState: "complete"`, but no Pagefind input was created, no shortcut hints were added, and a real CDP Ctrl+K key event left the search modal at `display: none`.

This is a reproducible **dead enhancement UI**, not an infinite loop or CPU freeze. Ordinary static links remain independent of these handlers.

**Minimal recommendation:** catch both storage reads and writes, falling back to in-memory/default angle. The parent implemented the main-script guard in `8bbdc1c`; these measurements describe the live pre-fix bundle and do not claim that deployed production has been retested after that change. Umami's separate unguarded storage access can still throw when storage is denied, but an exception in that separate script does not itself abort the guarded main script.

### 3. Search and content scripts are not demonstrated freeze causes

The homepage eagerly loads Pagefind UI (119,987 decoded bytes, 35,886 transfer bytes in the deployed bundle) and initializes a hidden UI at DOMContentLoaded. No Pagefind index/WASM request appeared before a query in the measured runs. Deferring UI download/creation until the first search request would reduce startup work, but there is no measured long-task evidence that this is necessary to fix #75.

The small shared content runtime (1668 decoded bytes) did not request Mermaid, MathJax or zoom on the homepage. Those libraries therefore should not be blamed for this measurement. The source's moss-loader DOM insertion timer starts only after the deliberate rapid-logo-click easter egg, not ordinary page load.

## Reproduction and remaining uncertainty

To repeat: launch Chrome with a clean temporary `--user-data-dir`, `--headless=new`, and a local `--remote-debugging-port`; use CDP `Network.setCacheDisabled`, `Page.addScriptToEvaluateOnNewDocument` for PerformanceObservers, then `Page.navigate` to the production homepage. Read `performance.getEntriesByType('navigation'|'paint'|'resource')`, observer entries, `Runtime.exceptionThrown`, `Log.entryAdded`, and `Network.loadingFailed`. For storage denial, inject throwing Storage methods before navigation and test Ctrl+K after the document completes. The temporary raw timing capture for this session is `/tmp/blog75-perf.json` (not a permanent repository artifact).

These results do not reproduce the original user's browser/profile/extensions, network, or the earlier rollout/node interruption. They do not prove a server-side incident was absent at the time of the report, nor establish that denied storage was that user's condition. No Safari/Firefox, real low-end device, long browsing session or production post-fix measurement was performed. Capture a HAR, console output and a Performance trace from the affected user's actual freeze before declaring the issue resolved. The strongest established findings are the large font transfer and the storage-denial failure mode.
