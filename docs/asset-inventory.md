# LDC Travel Asset Inventory

## Source directory

`A:/Projects/Travel-content` remains reference-only. The newly supplied redesign logos were provided from `A:/Downloads` and copied into the project without modifying their source files.

| Source file | Variant | Intended project usage | Project destination |
|---|---|---|---|
| `A:/Downloads/ldc-logo-blue.webp` | Blue full lockup | Light header and mobile drawer | `public/brand/ldc-logo-blue.webp` |
| `A:/Downloads/ldc-logo-yellow.webp` | Yellow full lockup | Blue footer and strong blue surfaces | `public/brand/ldc-logo-yellow.webp` |
| `A:/Downloads/ldc-logo-black.webp` | Black full lockup | Available for future light-background treatments | `public/brand/ldc-logo-black.webp` |
| `public/hero-travel.webp` | Supplied lake/mountain hero photograph | Homepage hero fallback and preview image | `public/hero-travel.webp` |

The existing five legacy brand files in `public/brand/` remain untouched for rollback/reference compatibility. The supplied redesign files are the authoritative current public logo choices.

## Logo selection

- Header: `ldc-logo-blue.webp` on white.
- Mobile drawer: `ldc-logo-blue.webp` on white.
- Footer: `ldc-logo-yellow.webp` on `#173C86` blue.
- Favicon/app icon: retained existing icon-only asset because the supplied files are full lockups and no dedicated new emblem file was provided. The wordmark was not cropped or distorted.

## Remote imagery

Demo destination and inspiration imagery uses explicit Unsplash image IDs already allowed by the Next Image configuration. Production editors should use Payload Media uploads. The source directory and supplied source files are not modified.
