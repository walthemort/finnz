# Finnz Træ & Design

Dansk, responsiv præsentationsside bygget med Vite og almindelig JavaScript/CSS.

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

Kontaktformularen sender ikke data til en server. Uden en e-mailadresse kan besøgende forberede og kopiere deres forespørgsel, og siden viser telefonnummeret samt en e-mailpladsholder. Når `VITE_CONTACT_EMAIL` er sat, åbner formularen brugerens mailapp med en kladde. Brugeren sender selv e-mailen.

## Indhold og billeder

- Original logopakke findes uændret under `public/brand/`.
- Logofilerne indeholder tekst, som refererer til Amboy-fonten; denne font er ikke inkluderet i pakken. Navigationens logovisning bruger det originale symbol med en separat tekstbehandling. Få gerne leveret et endeligt logo med tekst konverteret til kurver.
- De to WebP-billeder under `public/images/` er genererede stemningsvisualiseringer, ikke dokumentation for udførte Finnz-opgaver. Siden oplyser dette.
- Tekster og ydelseseksempler er foreløbige og skal bekræftes af virksomheden inden lancering. Den eksisterende hjemmeside kunne ikke læses fra cloudmiljøet (netværkspolitikken returnerede HTTP 403).
- Ingen CVR, adresse, priser eller kundereferencer er opfundet.

## Kontrol

Build er kontrolleret med `npm run build`. Browserkontrol i Chromium omfatter desktop/mobil, navigation, projektmodaler, formularvalidering, klargøring og kopiering af forespørgsel, telefonlink, Escape-lukning, billedindlæsning og kontrol af vandret overflow. Animationer tager hensyn til `prefers-reduced-motion`.

Hjemmesiden er ikke publiceret.
