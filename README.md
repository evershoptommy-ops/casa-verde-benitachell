# Casa Verde — Benitachell, Costa Blanca

Vakantiewoning-website voor Casa Verde, een duplex-appartement in Benitachell (Costa Blanca, Spanje). Het ontwerp komt uit een Claude Design-export; deze repo maakt daar een productieklare, statische site van voor Netlify.

## Structuur

```
/
├── index.html          Homepage — hero, over de woning, voorzieningen, slaapkamers,
│                        locatie, reviews, boeken, contactformulier, footer
├── success.html         Bedankpagina na het versturen van het contactformulier
├── css/
│   └── style.css        Reset, :hover-states, responsive/mobiel overrides
├── js/
│   └── main.js           Footer-jaartal + Netlify Forms (AJAX met fallback)
├── images/               Alle foto's (uitgepakt uit de originele design-export)
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
- **SEO**: meta description in het Engels (taal van de pagina-inhoud) én een Nederlandstalige variant, bilinguale keywords, Open Graph- en Twitter Card-tags, `og:locale` + `og:locale:alternate` (NL/DE) voor internationale zichtbaarheid, canonical URL, en JSON-LD structured data (`LodgingBusiness`).
- **Responsive/mobiel**: de originele export had geen enkele media query (vaste grid-lay-outs zoals 2- en 3-koloms grids zouden op mobiel volledig fout weergeven). Er zijn `class`-hooks toegevoegd (zonder bestaande `style="..."` aan te passen) plus responsive CSS-overrides in `css/style.css`, zodat alles goed werkt vanaf ongeveer 320px breed.
- **README + Git/Netlify-ready structuur** (dit bestand, `.gitignore`, `netlify.toml`).

## Voor je live gaat: nog even nalopen

1. **Domein**: vervang `https://casa-verde-benitachell.netlify.app/` (canonical URL, Open Graph/Twitter image-URLs, sitemap.xml) door je echte Netlify-/eigen domein, in `index.html`, `robots.txt` en `sitemap.xml`.
2. **`images/location-map.png`** is ~1 MB (het is 1:1 overgenomen uit de originele export om het beeld niet aan te tasten). Voor een snellere paginalaadtijd kun je dit bestand later comprimeren of naar JPEG converteren — puur een performance-optimalisatie, geen visuele wijziging.
3. **Netlify Forms inschakelen**: zodra je deployt, detecteert Netlify het formulier in `index.html` automatisch (dankzij `data-netlify="true"`). Ga daarna naar **Site settings → Forms** in Netlify om e-mailnotificaties in te stellen zodat je een mailtje krijgt bij elke aanvraag.
4. **Google Maps-link**: de "Get directions"-link in de locatiesectie wijst al naar het juiste adres (Calle Thomas-Wilson, Cumbre del Sol, Benitachell) — controleer of dit klopt met het definitieve adres.

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
