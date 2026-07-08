# Casa Verde — Benitachell, Costa Blanca

Vakantiewoning-website voor Casa Verde, een duplex-appartement in Benitachell (Costa Blanca, Spanje). Het ontwerp komt uit een Claude Design-export; deze repo maakt daar een productieklare, statische site van voor Netlify.

## Structuur

```
/
├── index.html          Homepage in het Engels (standaardtaal) — hero, over de woning,
│                        voorzieningen, slaapkamers, locatie, reviews, boeken,
│                        contactformulier, footer
├── success.html         Engelse bedankpagina na het versturen van het contactformulier
├── nl/
│   ├── index.html       Nederlandse vertaling van de homepage
│   └── success.html     Nederlandse bedankpagina
├── de/
│   ├── index.html       Duitse vertaling van de homepage
│   └── success.html     Duitse bedankpagina
├── es/
│   ├── index.html       Spaanse vertaling van de homepage
│   └── success.html     Spaanse bedankpagina
├── css/
│   └── style.css        Reset, :hover-states, responsive/mobiel overrides, taalwisselaar
├── js/
│   └── main.js           Footer-jaartal + Netlify Forms (AJAX met fallback) — gedeeld door alle 4 talen
├── images/               Alle foto's (uitgepakt uit de originele design-export), gedeeld door alle talen
│   └── gallery/
│       ├── thumb/         Kleine WebP/JPG-versies (max 640px) voor de gallery-grid
│       └── full/          Volledige resolutie voor de lightbox
├── netlify.toml           Netlify build- en headers-configuratie
├── robots.txt
├── sitemap.xml
├── .gitignore
└── Casa Verde Homepage.html   Origineel Claude Design-exportbestand (bewaard als bron/backup)
```

## Wat is er gedaan (en wat niet)

Het **ontwerp zelf is niet aangepast** — alle teksten, kleuren, lay-out, foto's en typografie zijn exact hetzelfde gebleven. Wat wél is aangepakt:

- **Netlify-ready structuur**: het originele bestand was een "Claude Design"-preview-bundle (alle content/afbeeldingen/fonts zaten als base64 verstopt in één HTML-bestand, met een intern preview-script dat alleen in de design-tool werkt). Dat is nu omgezet naar een normale, valide statische site: losse `index.html`, `css/style.css`, `js/main.js` en losse afbeeldingsbestanden in `images/`.
- **Fonts**: de fonts (Cormorant Garamond en Work Sans) worden nu via Google Fonts geladen in plaats van als ingebakken bestanden — zelfde lettertypen, lichter gewicht, sneller laden.
- **Contactformulier + Netlify Forms**: de oorspronkelijke design had geen contactformulier (alleen een link naar Booking.com). Er is een nieuwe sectie "Get in touch" toegevoegd — met naam, e-mail, gewenste periode en bericht — in dezelfde stijl als de rest van de pagina, met volledige Netlify Forms-integratie (geen backend nodig).
- **`:hover`-states**: de export gebruikte een niet-standaard `style-hover="..."` attribuut van de design-tool dat browsers negeren. Dit is omgezet naar echte CSS `:hover`-regels, zodat de knop- en link-hover-effecten nu ook echt werken.
- **SEO**: elke taalpagina heeft eigen title/description/keywords, Open Graph- en Twitter Card-tags, `og:locale` + `og:locale:alternate` (naar de andere 3 talen), canonical URL, `hreflang`-links naar alle taalversies (en/nl/de/es/x-default), en JSON-LD structured data (`LodgingBusiness`) met `inLanguage`.
- **Responsive/mobiel**: de originele export had geen enkele media query (vaste grid-lay-outs zoals 2- en 3-koloms grids zouden op mobiel volledig fout weergeven). Er zijn `class`-hooks toegevoegd (zonder bestaande `style="..."` aan te passen) plus responsive CSS-overrides in `css/style.css`, zodat alles goed werkt vanaf ongeveer 320px breed.
- **Meertaligheid (NL/DE/ES/EN)**: aparte statische pagina per taal (beter voor SEO dan een JavaScript-taalwisselaar — elke taal is apart indexeerbaar door Google). Een compacte vlaggen-schakelaar in de navigatiebalk (herbruikbare inline SVG-vlaggen, geen emoji — die renderen inconsistent op Windows) linkt tussen `/`, `/nl/`, `/de/` en `/es/`. Elk taalcontactformulier heeft een eigen Netlify Forms-naam (`contact-en`/`contact-nl`/`contact-de`/`contact-es`) zodat aanvragen per taal herkenbaar zijn in het Netlify-dashboard, en wijst naar zijn eigen vertaalde bedankpagina.
- **Fotogalerij**: 27 foto's uit de map `foto`s/` (huis, kamers, resort, strand) verwerkt tot een galerij tussen "Over de woning" en "Voorzieningen", op elke taalpagina met eigen vertaalde alt-teksten. Pinterest-stijl masonry-grid (3 kolommen desktop, 2 op tablet ≥768px), een swipebare carousel op mobiel (<768px, native scroll-snap — geen JS nodig voor het swipen zelf), en een volledig-scherm lightbox (PhotoSwipe v5 via CDN) met pijltjesnavigatie en pinch-to-zoom. Elke foto heeft een kleine WebP-thumbnail (met JPG-fallback via `<picture>`) voor de grid en laadt pas de volledige resolutie zodra je 'm in de lightbox opent. Alle 27 originele foto's staan ook nog als backup in `foto`s/` (niet in git, zie `.gitignore`).
- **README + Git/Netlify-ready structuur** (dit bestand, `.gitignore`, `netlify.toml`).

## Voor je live gaat: nog even nalopen

1. **Domein**: vervang `https://casa-verde-benitachell.netlify.app/` (canonical URL's, Open Graph/Twitter image-URLs, hreflang-links, sitemap.xml) door je echte Netlify-/eigen domein — dit staat in `index.html`, `nl/index.html`, `de/index.html`, `es/index.html`, `robots.txt` en `sitemap.xml`.
2. **`images/location-map.png`** is ~1 MB (het is 1:1 overgenomen uit de originele export om het beeld niet aan te tasten). Voor een snellere paginalaadtijd kun je dit bestand later comprimeren of naar JPEG converteren — puur een performance-optimalisatie, geen visuele wijziging.
3. **Netlify Forms inschakelen**: zodra je deployt, detecteert Netlify alle 4 formulieren automatisch (dankzij `data-netlify="true"` op elke taalpagina). Ga daarna naar **Site settings → Forms** in Netlify om e-mailnotificaties in te stellen zodat je een mailtje krijgt bij elke aanvraag, in elke taal.
4. **Google Maps-link**: de "Get directions"-link (en de vertaalde varianten) in de locatiesectie wijst al naar het juiste adres (Calle Thomas-Wilson, Cumbre del Sol, Benitachell) — controleer of dit klopt met het definitieve adres.

## Lokaal bekijken

Dit is een pure statische site (geen build-stap nodig). Open `index.html` direct in de browser, of start een lokale server:

```bash
npx serve .
# of
python -m http.server 8000
```

## Deployen naar Netlify

1. Push deze map naar een Git-repository (GitHub/GitLab/Bitbucket).
2. In Netlify: **Add new site → Import an existing project**, kies de repo.
3. Build command: leeg laten. Publish directory: `.` (staat al in `netlify.toml`).
4. Deploy — Netlify Forms wordt automatisch actief na de eerste deploy.
