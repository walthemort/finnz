# Finnz Træ & Design

En kort, dansk præsentationsside med ét hovedbudskab, ét stemningsbillede, en kompakt inspirationsrække og direkte kontakt. Bygget med Vite og almindelig JavaScript/CSS.

## Lokal udvikling

Kræver Node.js 20.19+ eller 22.12+ (miljøet er valideret med Node 24).

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

Produktionsfiler ligger i `dist/` og kan hostes som en statisk hjemmeside. Fontfiler og billeder leveres lokalt uden eksterne font- eller billedkald. Der er ingen analyseværktøjer eller eksterne formularservices.

## Kontaktoplysninger

Telefonnummeret er +45 41 35 20 25. Kopiér `.env.example` til `.env.local`, hvis du vil tilføje e-mail eller ændre telefonnummer lokalt:

- `VITE_CONTACT_EMAIL`: Den rigtige modtageradresse. Tom som standard, indtil adressen er bekræftet.
- `VITE_CONTACT_PHONE`: Telefonnummer med landekode.

Genstart udviklingsserveren efter ændringer i miljøvariabler. Kør et nyt build efter ændringer før publicering. VITE-variabler er offentlige klientværdier og må aldrig indeholde hemmeligheder.

Kontakt foregår direkte via telefonlinket. E-mail vises som pladsholder, indtil `VITE_CONTACT_EMAIL` er sat; derefter vises et almindeligt mailto-link. Siden har ingen formular eller mobilmenu. Inspirationsbilleder kan åbnes i et galleri med tastaturbetjening; på mobil kan projektrækken swipes.

## Indhold og billeder

- Originale SVG- og WebP-logopakker ligger under `public/brand/`. De er bevaret uden ændringer.
- Header og footer bruger den originale `logo-black.webp` fra brugerens ZIP, så logoteksten ikke afhænger af en installeret font. Favicon og desktopcursor bruger `mark-outlined.webp` (ZIP-filens `Asset 12.webp`) med brugerens hvide kant.
- De gamle SVG-wordmarks indeholder stadig `<text>` med `font-family: Amboy-Black`. Derfor kræver de Amboy-fonten; en SVG med korrekt outlined tekst har bogstavernes geometri som paths. Brug `Type → Create Outlines` i Illustrator, eksportér en ny SVG og kontrollér selve eksporten, før der skiftes tilbage til SVG.
- De to lokale WebP-fotos er genererede stemningsvisualiseringer, ikke dokumentation for udførte Finnz-opgaver. Siden oplyser dette ved inspirationsrækken. Tilføj rigtige projektfotos og bekræftede titler i `projects`-listen i `src/main.js`, når de foreligger.
- F-cursoren vises kun ved mus og præcis pointer på enheder med hover. Den skjules ved tastaturbrug, uden for siden og ved `prefers-reduced-motion`. Native cursor er fallback, hvis billedet ikke indlæses. Cursoren følger musen direkte og bliver lidt større over links. Billedfilerne er ikke genskabt eller ændret.
- Den korte præsentationstekst er foreløbig og skal bekræftes af virksomheden inden lancering. Den eksisterende hjemmeside kunne ikke læses fra cloudmiljøet (netværkspolitikken returnerede HTTP 403).
- Ingen CVR, adresse, priser eller kundereferencer er opfundet.

## Kontrol

Build er kontrolleret med `npm run build`. Browserkontrol i Chromium omfatter desktop/mobil, kontaktanker, telefonlink, e-mailpladsholder, originale WebP-logoer, favicon, mus/touch/reduced-motion cursor, galleriets knapper, tastatur og Escape, mobilrækkens swipe samt billedindlæsning og vandret overflow. Animationer tager hensyn til `prefers-reduced-motion`.

Hjemmesiden er ikke publiceret.
