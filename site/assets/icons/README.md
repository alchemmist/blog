# Local inline icons

`layouts/partials/iconify.html` reads these SVGs with `resources.Get`. No icon
service, JavaScript runtime, or network access is needed to render them. A
missing icon fails the Hugo build instead of silently publishing an empty span.

The 22 icons cover every `iconify` partial call in the layouts: Follow links,
sharing links, navigation, bookshelf statuses, Mustreads, and course materials.
Files are named `<collection>/<icon>.svg` for the existing `collection:icon`
partial argument. The partial preserves its `class` argument and sets SVG width
and height from `size` (default `1em`).

## Sources and licenses

Artwork was vendored from `https://api.iconify.design/<collection>/<icon>.svg`.
The corresponding Iconify collection metadata, upstream authors, and license
links are recorded in `sources.json`; upstream license notices/text are in
`licenses/`. Original viewBoxes, paths, fills, and other artwork are unchanged.
Only root width/height attributes were removed because the partial supplies
those attributes at render time. Brand icons remain subject to their owners'
trademark policies.

The existing `teenyicons:document-text-solid` call uses a compatibility filename
for upstream `teenyicons:text-document-solid`; the former is not an upstream icon
name. This alias is also recorded in `sources.json`.

## Adding or updating an icon

1. Download the SVG explicitly during development, not in a build step.
2. Save it under `<collection>/<icon>.svg`, retaining its viewBox and removing
   only the root width/height attributes. Review the SVG before inlining it.
3. Preserve/add the upstream author and license information in `sources.json`
   and `licenses/`.
4. Build Hugo and run `python3 scripts/check-follow-icons.py site/public` from
   the repository root. The check parses rendered HTML and requires inline SVGs
   in all ten Follow entries on the generated homepages.
