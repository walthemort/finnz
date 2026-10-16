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

Kontakt foregår direkte via telefonlinket. E-mail vises som pladsholder, indtil `VITE_CONTACT_EMAIL` er sat; derefter vises et almindeligt mailto-link. Kontaktformularen er altid synlig i kontaktsektionen. Den klargør og kopierer beskeder, indtil e-mailadressen er kendt. Med `VITE_CONTACT_EMAIL` åbner den en e-mailkladde i brugerens mailapp; der er ingen serverafsendelse eller leveringsbekræftelse. Siden har ingen mobilmenu. Inspirationskort åbner en fuldskærmsside med to billeder, tekst, materialefakta og kontakt-CTA. Billedvælgeren kan betjenes med piletaster og thumbnails; på mobil kan projektrækken swipes.

## Indhold og billeder

- Originale SVG- og WebP-logopakker ligger under `public/brand/`. De er bevaret uden ændringer.
- Header og footer bruger den originale `logo-black.webp` fra brugerens ZIP, så logoteksten ikke afhænger af en installeret font. Desktopcursor bruger `mark-outlined.webp` (ZIP-filens `Asset 12.webp`) med brugerens hvide kant. Favicon er en kvadratisk SVG-wrapper med det samme WebP-billede indlejret og `preserveAspectRatio="xMidYMid meet"`; billedet strækkes ikke. Regenerér wrapperen med `node scripts/generate-favicon.mjs`, hvis originalikonet udskiftes. Originalbilledets bytes er uændrede.
- De gamle SVG-wordmarks indeholder stadig `<text>` med `font-family: Amboy-Black`. Derfor kræver de Amboy-fonten; en SVG med korrekt outlined tekst har bogstavernes geometri som paths. Brug `Type → Create Outlines` i Illustrator, eksportér en ny SVG og kontrollér selve eksporten, før der skiftes tilbage til SVG.
- De lokale WebP-fotos er genererede stemningsvisualiseringer, ikke dokumentation for udførte Finnz-opgaver. Siden oplyser dette ved inspirationsrækken. Tilføj rigtige projektfotos og bekræftede tekster i `src/projects.js`, når de foreligger. Hvert koncept har to selvstændige billedvinkler; de supplerende billeder er også genererede visualiseringer.
- F-cursoren vises kun ved mus og præcis pointer på enheder med hover. Den skjules ved tastaturbrug, uden for siden og ved `prefers-reduced-motion`. Native cursor er fallback, hvis billedet ikke indlæses. Cursoren følger musen direkte og bliver lidt større over links. Billedfilerne er ikke genskabt eller ændret.
- Den korte præsentationstekst er foreløbig og skal bekræftes af virksomheden inden lancering. Den eksisterende hjemmeside kunne ikke læses fra cloudmiljøet (netværkspolitikken returnerede HTTP 403).
- Ingen CVR, adresse, priser eller kundereferencer er opfundet.

## Materialevælger

`src/materials.js` indeholder tre vejledende materialer: eg, valnød og ask. Alle visninger bruger samme bord og rum, med genererede variationer i bordets træsort. Farver, træsorter og overflader er inspiration, ikke bekræftet sortiment eller en nøjagtig farveprøve. Overfladeønsket ændrer ikke visualiseringen, som illustrerer træsorten.

Der er intet forudvalgt materiale; startbilledet er et eksempel i eg. Besøgende vælger med mus, touch eller radioknappernes tastaturbetjening og kan nulstille med “Jeg vælger senere”. Materiale og overflade vises i formularen og indgår i både den kopierede besked og en e-mailkladde. Ændret materialevalg skjuler en tidligere klargjort besked, så den ikke kan kopieres med forældede valg. Valgene gemmes kun i den aktuelle sides hukommelse; navn, e-mail, besked og projektreference bevares ved materialeskift.

## Intro

Introen ligger direkte i HTML og vises ved hver indlæsning, også ved genindlæsning med cached billeder og fonte. Logoet vises mindst 1,1 sekund, før det fader ud. Ved reduceret bevægelse vises en statisk udgave i mindst 0,35 sekund. Parathed af hovedbillede og fonte kan forlænge visningen til højst 2,2 sekunder plus udtoning. Ingen session storage eller falsk procenttæller bruges. Tastatur eller klik afslutter straks introen. En separat HTML-sikring fjerner overlayet efter 5 sekunder, hvis JavaScript-modulet fejler.

## Projektvisning

Fuldskærmsvisningen kan scrolles uafhængigt af forsiden. Fast topbjælke giver altid adgang til lukning; Escape gendanner fokus på projektkortet. Pilknapper, thumbnails og tastaturets piletaster skifter billeder inden for det valgte projekt. “Næste inspiration” skifter projekt. CTA’en “Ønsker du noget lignende?” går til den synlige kontaktformular og indsætter en projektreference, hvis beskedfeltet er tomt. Allerede indtastede oplysninger bevares.

## Kontrol

Build er kontrolleret med `npm run build`. Browserkontrol i Chromium omfatter desktop/mobil, kontaktanker, telefonlink, e-mailpladsholder, originale WebP-logoer, faviconets billedproportioner ved 16/32/64 px, introens parathed/timeout/genbesøg/reduceret bevægelse, formularens synlighed, validering og kopiering samt materialevalg, nulstilling og overførsel til beskeden, mus/touch/reduced-motion cursor, galleriets knapper, tastatur og Escape, mobilrækkens swipe samt billedindlæsning og vandret overflow. Animationer tager hensyn til `prefers-reduced-motion`.

Hjemmesiden er ikke publiceret.
