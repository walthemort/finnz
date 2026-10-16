# Finnz Træ & Design

En kort, dansk præsentationsside med ét hovedbudskab, et hovedbillede af træarkitektur, en kompakt projektrække og direkte kontakt. Bygget med Vite og almindelig JavaScript/CSS.

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

Kontakt foregår direkte via telefonlinket. E-mail vises som pladsholder, indtil `VITE_CONTACT_EMAIL` er sat; derefter vises et almindeligt mailto-link. “Skriv til os i dag” åbner kontaktformularen i et fuldskærmsvindue på samme side. Formularen fylder ikke på forsiden. Den klargør og kopierer beskeder, indtil e-mailadressen er kendt. Med `VITE_CONTACT_EMAIL` åbner den en e-mailkladde i brugerens mailapp; der er ingen serverafsendelse eller leveringsbekræftelse. Siden har ingen mobilmenu. Projektkort åbner et fuldskærmsvindue på samme side med tre billeder, tekst, projektfakta og kontakt-CTA. Billedvælgeren kan betjenes med piletaster og de øvrige billedvinkler; på mobil kan projektrækken swipes.

## Indhold og billeder

- Originale SVG- og WebP-logopakker ligger under `public/brand/`. De er bevaret uden ændringer.
- Header og footer bruger den originale `logo-black.webp` fra brugerens ZIP, så logoteksten ikke afhænger af en installeret font. Desktopcursor bruger `mark-outlined.webp` (ZIP-filens `Asset 12.webp`) med brugerens hvide kant. Favicon er en kvadratisk SVG-wrapper med det samme WebP-billede indlejret og `preserveAspectRatio="xMidYMid meet"`; billedet strækkes ikke. Regenerér wrapperen med `node scripts/generate-favicon.mjs`, hvis originalikonet udskiftes. Originalbilledets bytes er uændrede.
- De gamle SVG-wordmarks indeholder stadig `<text>` med `font-family: Amboy-Black`. Derfor kræver de Amboy-fonten; en SVG med korrekt outlined tekst har bogstavernes geometri som paths. Brug `Type → Create Outlines` i Illustrator, eksportér en ny SVG og kontrollér selve eksporten, før der skiftes tilbage til SVG.
- `src/projects.js` indeholder nu to udførte Finnz-projekter fra brugerens fotos: et mørkt havehus og en terrasse med træafskærmning. Hvert projekt har tre AI-redigerede billeder i `public/images/projects/01/` og `02/`, optimeret til WebP. Siden oplyser, at fotografierne er AI-redigerede; de skal ikke bruges som præcis dokumentation for farver eller konstruktionsdetaljer. Tekster beskriver kun det synlige arbejde uden at opfinde træsort, mål, sted eller kunde. PNG-pakkerne kan hentes fra `downloads/finnz-projekt-01.zip` og `downloads/finnz-projekt-02.zip`. Materialevælgeren bruger fortsat tydeligt mærkede, genererede stemningsvisualiseringer.
- Hovedbilledet `public/images/editorial/garden-hero.webp` er en ny AI-genereret stemningsvisualisering af sort træbeklædning, lys træafskærmning og en grøn have. Det er mærket som visualisering og er ikke et udført Finnz-projekt.
- Trælamellerne i kontaktvinduet (`public/images/editorial/timber.webp`) stammer fra `hello-world-featured.jpg` i brugerens ZIP fra det gamle site. Billedet er AI-redigeret og mærket som stemningsfoto. Det vises kun i kontaktvinduets desktoplayout. Den tidligere høvleillustration er bevaret som fil og i `downloads/finnz-stemningsbilleder.zip`, men vises ikke på siden.
- F-cursoren vises kun ved mus og præcis pointer på enheder med hover. Den skjules ved tastaturbrug, uden for siden og ved `prefers-reduced-motion`. Native cursor er fallback, hvis billedet ikke indlæses. Cursoren følger musen direkte og bliver lidt større over links. Billedfilerne er ikke genskabt eller ændret.
- Den korte præsentationstekst er foreløbig og skal bekræftes af virksomheden inden lancering. Den eksisterende hjemmeside kunne ikke læses fra cloudmiljøet (netværkspolitikken returnerede HTTP 403).
- Ingen CVR, adresse, priser eller kundereferencer er opfundet.

## Materialevælger

`src/materials.js` har præcis to farvevalg: “Lys” og “Sort”. Begge viser samme afskærmning omkring affaldsbeholdere fra brugerens foto, visualiseret med AI. Der vælges ikke træsort eller overfladebehandling i vælgeren. Behandlingen aftales med Finnz; billederne er vejledende. Filerne er `public/images/materials/enclosure-pine.webp` (lys) og `enclosure-black.webp` (sort), vist i kvadratisk format uden beskæring.

Intet farveønske er forudvalgt; startbilledet viser lyst træ. Besøgende vælger med mus, touch eller radioknappernes tastaturbetjening og kan nulstille med “Jeg vælger senere”. Farven følger med til kontaktformularen og indgår i klargjorte/kopierede beskeder som “Farveønske”. Ændret farve skjuler tidligere klargjort output, mens navn, e-mail og besked bevares. Valgene gemmes kun i den aktuelle sides hukommelse.

## Intro

Introen ligger direkte i HTML og vises ved hver indlæsning, også ved genindlæsning med cached billeder og fonte. Logoet vises mindst 1,1 sekund, før det fader ud. Ved reduceret bevægelse vises en statisk udgave i mindst 0,35 sekund. Parathed af hovedbillede og fonte kan forlænge visningen til højst 2,2 sekunder plus udtoning. Ingen session storage eller falsk procenttæller bruges. Tastatur eller klik afslutter straks introen. En separat HTML-sikring fjerner overlayet efter 5 sekunder, hvis JavaScript-modulet fejler.

## Projektvisning

Fuldskærmsvisningen kan scrolles uafhængigt af forsiden. Portrætfotos vises i fuldt format i et kompakt galleri: på desktop står det valgte billede lidt større til venstre, og de to øvrige vinkler står ved siden af. På mobil/tablet ligger de to mindre billeder samlet under hovedbilledet. Klik på en anden vinkel bytter den med hovedbilledet, så alle tre billeder fortsat er synlige uden gentagelser. Fast topbjælke giver adgang til lukning via både det originale logo og “Luk projekt”; Escape gendanner fokus på projektkortet. Pilknapper, de to øvrige billedvinkler og tastaturets piletaster skifter billeder inden for det valgte projekt. “Næste projekt” skifter projekt. CTA’en “Ønsker du noget lignende?” åbner kontaktvinduet oven på projektvisningen og indsætter en projektreference, hvis beskedfeltet er tomt. Allerede indtastede oplysninger bevares.

## Kontrol

Build er kontrolleret med `npm run build`. Browserkontrol i Chromium omfatter desktop/mobil, kontaktanker, telefonlink, e-mailpladsholder, originale WebP-logoer, faviconets billedproportioner ved 16/32/64 px, introens parathed/timeout/genbesøg/reduceret bevægelse, kontaktvinduets fuldskærmslayout, fokus og Escape-lukning, formularens validering og kopiering samt materialevalg, nulstilling og overførsel til beskeden, mus/touch/reduced-motion cursor, galleriets knapper, tastatur og Escape, mobilrækkens swipe samt billedindlæsning og vandret overflow. Animationer tager hensyn til `prefers-reduced-motion`.

Hjemmesiden er ikke publiceret.

## Kontaktvindue og navigation

Alle kontaktknapper åbner det samme native `dialog`: header, kontaktsektion, inspirationsfelt, materialevælger og projekt-CTA. Der er ingen ekstra HTML-sider eller router. Kontaktvinduet og projektvinduet er overlays på forsiden, og åbning/lukning ændrer ikke URL'en.

Når kontakt åbnes fra et projekt, forbliver projektvinduet nedenunder. Lukning/Escape vender tilbage til projektet og den knap, der åbnede formularen. “Tilpas” i formularen lukker begge vinduer og fokuserer materialevælgeren på forsiden. Navn, e-mail, besked og materialeønske bevares ved lukning, genåbning og vinduesskift. Body-scroll og F-cursorens placering følger det øverste åbne vindue.

## Projektanimation

`src/project-motion.js` lader kortets billede og papirets ramme vokse ind i fuldskærmsvisningen. Billedet beskæres med `object-fit: cover` under bevægelsen og bliver ikke strakt. Ved lukning via logo, knap eller Escape foldes billedet tilbage til det aktuelle projektkort. Forskellige billedvalg blandes tilbage til kortets billede. Lukning under åbneanimationen vender den igangværende bevægelse om. Reduceret bevægelse og browsere uden Web Animations bruger øjeblikkelig åbning/lukning.

Billedet, man åbner fra, vises først i projektet for at bevare kontinuiteten. Ved navigation fra kontaktformularen tilbage til materialer lukkes projektet straks, så animationen ikke flytter fokus væk fra materialevælgeren. Midlertidige billedlag og animationer ryddes op, når vinduet lukkes.
