# LDC Travel Asset Inventory

## Source directory

`A:/Projects/Travel-content` remains reference-only. The newly supplied redesign logos were provided from `A:/Downloads` and copied into the project without modifying their source files.

| Source file | Variant | Intended project usage | Project destination |
|---|---|---|---|
| `A:/Downloads/navylogo.webp` | Navy full lockup | Light header, mobile drawer, favicon source, and structured data | `public/brand/ldc-logo-navy.webp` |
| `A:/Downloads/orangelogo.webp` | Orange full lockup | Navy footer and orange-on-dark branded surfaces | `public/brand/ldc-logo-orange.webp` |
| `public/hero-travel.webp` | Supplied lake/mountain hero photograph | Retained legacy asset for rollback/reference; no longer the homepage default | `public/hero-travel.webp` |

The existing legacy brand files in `public/brand/` remain untouched for rollback/reference compatibility. The navy/orange files are the authoritative current public logo choices.

## Logo selection

- Header: `ldc-logo-navy.webp` on white.
- Mobile drawer: `ldc-logo-navy.webp` on white.
- Footer: `ldc-logo-orange.webp` on `#123665` navy.
- Favicon/app icon: `src/app/icon.png` and `src/app/apple-icon.png` use a favicon-safe transparent crop of the emblem from `public/brand/ldc-logo-navy.webp`; the original full lockup remains unchanged.

## Remote imagery

Demo destination and inspiration imagery uses explicit Unsplash image IDs already allowed by the Next Image configuration. Production editors should use Payload Media uploads. The source directory and supplied source files are not modified.

The homepage demo/seed hero uses the verified [Maya Bay, Phi Phi Islands photo](https://unsplash.com/photos/boats-on-turquoise-maya-bay-water-TejFa7VW5e4), represented by Unsplash image `photo-1534008897995-27a23e859048`; its source identifies Maya Bay, Ko Phi Phi, Thailand and describes turquoise water between limestone cliffs. The Indonesia demo/listing/detail image uses the verified [Borobudur temple photo](https://unsplash.com/photos/borobudur-temple-stupas-at-dawn-with-misty-mountains-hLryfyTDgGs), represented by Unsplash image `photo-1780748549579-c22a0ff53982`; its source labels the subject as Borobudur, Magelang Regency, Central Java, Indonesia.
