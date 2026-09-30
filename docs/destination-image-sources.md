# Destination image source record

Reviewed 2026-09-30. Remote image inputs use the original Unsplash CDN asset path without upstream width/quality transforms; Next/Image applies responsive optimization. Source pages below identify each selected remote subject and show the Unsplash License status at review time.

## Turkey

- Detail hero and gallery: client-supplied `public/destinations/turkey.webp`; the provided image depicts historic mosque domes and minarets in Istanbul. No original source URL was supplied with the file.
- Istanbul highlight/gallery: [Istanbul's Bosphorus and Maiden's Tower](https://unsplash.com/photos/istanbuls-bosphorus-strait-with-maidens-tower-and-city-skyline-oX244DoPdb4), image `photo-1766826236680-dc2f5529bac5`.
- Cappadocia highlight/gallery: [hot-air balloons over Cappadocia](https://unsplash.com/photos/hot-air-balloons-over-cappadocia-eOcyhe5-9sQ), image `photo-1530789253388-582c481c54b0`.
- Coast highlight/gallery: [Kaş coastal panorama](https://unsplash.com/photos/an-aerial-view-of-a-city-on-the-coast-GtHbVxFFDYI), image `photo-1689130033348-1ebe2612a3d8`; source location is Kaş, Antalya, Türkiye.

## Russia

- Moscow highlight/gallery: [Saint Basil's Cathedral](https://unsplash.com/photos/saint-basils-cathedral-moscow-russia-jaH3QF46gAY), image `photo-1513326738677-b964603b136d`.
- Saint Petersburg highlight/gallery: [canal and historic buildings](https://unsplash.com/photos/canal-with-buildings-and-a-boat-at-sunrise-PrtnVaz_PtI), image `photo-1764725726270-4f94dbaa16ac`.
- Moscow heritage highlight/gallery: [Kremlin above the river](https://unsplash.com/photos/the-moscow-kremlin-stands-tall-over-the-river-F3j7neUTmqQ), image `photo-1752986002031-579569bd3d6d`.
- Saint Petersburg gallery: client-supplied `public/destinations/georgia.webp`, which depicts Saint Isaac's Cathedral in Saint Petersburg; reused here with its verified Russian subject and alt text.

## Bali

- Ubud highlight/gallery: [Tegalalang Rice Terrace](https://unsplash.com/photos/rice-terraces-jN9JnZ-SyVc), image `photo-1557093793-d149a38a1be8`; source location is Ubud, Bali.
- Temple highlight/gallery: [Ulun Danu Beratan at Lake Beratan](https://unsplash.com/photos/black-and-white-pagoda-temple-near-green-grass-field-under-blue-and-white-cloudy-sky-during-iA7hK_zPoRU), image `photo-1583134993424-a40b553886a8`; source location is Candikuning, Bali.
- Coast highlight/gallery: [Uluwatu Temple on the coast](https://unsplash.com/photos/a-temple-sits-atop-a-cliff-by-the-sea-5wP_FxALL9s), image `photo-1752153417364-2e41ffac2db3`.
- Gallery: [Tanah Lot coast](https://unsplash.com/photos/a-rocky-beach-with-trees-and-a-body-of-water-fJnFhHWavBU), image `photo-1664551614393-b1b896485c7f`; source location is Pura Tanah Lot, Bali.

## Georgia

- Detail hero: client-supplied `public/destinations/georgia.webp`. Per the user's explicit follow-up, this image is retained for Georgia even though it depicts Saint Isaac's Cathedral in Saint Petersburg, Russia; it is not described as a Georgian landmark. This is a disclosed client-directed mismatch, not a verified Georgia image.
- Tbilisi highlight/gallery: [Old Town and the Kura River](https://unsplash.com/photos/river-with-bridge-and-old-town-on-hill-bjbBlbX-XEg), image `photo-1759506346306-5370eb85ae62`.
- Kazbegi highlight/gallery: [Gergeti Trinity Church below Mount Kazbek](https://unsplash.com/photos/snow-capped-mountain-with-gergeti-trinity-church-2ZcyeRzucoo), image `photo-1761649653559-bf4b309d15d6`.
- Kakheti highlight/gallery: [vineyard at Shakriani](https://unsplash.com/photos/a-vineyard-with-mountains-in-the-background-at-sunset-Lf__9L2SHVQ), image `photo-1688568383745-2369fe4abbc4`; source location is Shakriani, Kakheti, Georgia.

## Indonesia (outside Bali)

- Yogyakarta/Java highlight and gallery: [Borobudur at dawn](https://unsplash.com/photos/borobudur-temple-stupas-at-dawn-with-misty-mountains-hLryfyTDgGs), image `photo-1780748549579-c22a0ff53982`; source location is Magelang Regency, Central Java.
- Volcanic landscape highlight/gallery: [Mount Bromo at sunrise](https://unsplash.com/photos/mount-bromo-volcano-with-smoke-plume-5ZsI-rFsoHU), image `photo-1781813377841-a3a25348ed17`; source location is Bromo Tengger Semeru National Park, East Java.
- Java heritage gallery: [Prambanan temple complex](https://unsplash.com/photos/prambanan-temple-in-indonesia-FxvZx6llTpg), image `photo-1576233475048-55f08b53a8bd`; source location is Central Java, Indonesia.
- Wider archipelago highlight/gallery: [Pink Beach in Komodo National Park](https://unsplash.com/photos/stunning-tropical-beach-with-clear-blue-water-and-arid-hills-5KaHyYa0RTM), image `photo-1779983055454-0d5ea653b304`; source location is East Nusa Tenggara, Indonesia.

## Thailand

- Detail hero and gallery: client-supplied `public/destinations/thailand.webp`; the provided image depicts Wat Arun beside the Chao Phraya River at sunset in Bangkok. No original source URL was supplied with the file.
- Bangkok highlight/gallery: [Wat Arun temple complex](https://unsplash.com/photos/wat-arun-temple-complex-on-a-clear-day-ZHSgilufYWw), image `photo-1769850069487-494e221ce015`; source location is Bangkok, Thailand.
- Chiang Mai highlight/gallery: [Wat Sri Suphan](https://unsplash.com/photos/a-monk-walks-past-a-beautiful-silver-temple-in-thailand-HI9oRVBpIPk), image `photo-1785336741791-71b2d4608d5e`.
- Coast highlight/gallery and homepage hero: [Maya Bay, Phi Phi Islands](https://unsplash.com/photos/boats-on-turquoise-maya-bay-water-TejFa7VW5e4), image `photo-1534008897995-27a23e859048`.

## Reuse and CMS notes

The preview fallback and development seed read `src/content/destinations-data.json`. Homepage inspiration tiles now select the matching destination's canonical primary image rather than maintaining a duplicate list. The seed refreshes only known legacy demo image URLs and preserves uploaded Payload Media relations. Manually uploaded CMS assets remain editorial overrides and require a separate admin review if their depicted subjects have not been verified.

The homepage hero source is the original Unsplash asset `photo-1534008897995-27a23e859048`, reported by the source as 3992 × 2992 pixels. A byte size for the unparameterized original was not available from this restricted environment; the optimized Next image candidate was measured in the running browser instead.
