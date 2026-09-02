# LDC Travel Asset Inventory

## Source directory

`A:/Projects/Travel-content` was inspected as a read-only source/reference directory. It contains five logo files and the approved homepage reference image.

| Source file | Type / dimensions | Variant | Intended project usage | Project destination |
|---|---|---|---|---|
| `main-logo.webp` | WebP, 1254×1254, alpha | Full-color blue/cyan mark with navy wordmark and Tourism Marketing line | Default light-surface brand lockup; future header/footer | `public/brand/main-logo.webp` |
| `blue-logo.webp` | WebP, 1254×1254, alpha | Navy monochrome | Light backgrounds where a single-color mark is preferred | `public/brand/blue-logo.webp` |
| `cyan-logo.webp` | WebP, 1254×1254, alpha | Cyan monochrome | Brand accent treatments and light surfaces with sufficient contrast | `public/brand/cyan-logo.webp` |
| `orange-logo.webp` | WebP, 1254×1254, alpha | Orange monochrome | Accent-only placements where navy/cyan contrast is not appropriate | `public/brand/orange-logo.webp` |
| `white-logo.webp` | WebP, 1254×1254, alpha | White monochrome | Dark navy footer, photography overlays, and colored brand surfaces | `public/brand/white-logo.webp` |
| `homepage-design.png` | PNG, 905×1738, no alpha | Approved visual reference | Architecture and Phase 1 homepage direction only; not shipped as UI content | Not copied |

## Selection notes

- The light header direction in the screenshot maps to `main-logo.webp` or `blue-logo.webp`.
- The dark footer and any future dark/photographic hero overlay map to `white-logo.webp`.
- The monochrome cyan and orange variants are available for intentional contrast/accent contexts; they should not be recolored or used as a default without a contrast check.
- No icon-only source variant was provided. For small icon contexts, `src/app/icon.png` and `src/app/apple-icon.png` are derived from the emblem area of the official `blue-logo.webp`; the original source and copied brand assets remain unchanged.

## Source integrity

No files in `A:/Projects/Travel-content` were modified or deleted. The project contains copies of only the five logo variants needed for the foundation.
