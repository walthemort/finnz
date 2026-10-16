# Finnz Træ & Design

En kort dansk hjemmeside med projekter, farveinspiration og kontakt. Vite og almindelig JavaScript/CSS, med en lille Node-server til formularafsendelse. Projekter og kontakt åbner som fuldskærmsvinduer på samme side; der er ingen undersider eller router.

## Start og kontrol

Kræver Node.js 24.5+ (valideret med 24.19). Kommandoerne bruger indbygget `.env.local`-indlæsning og `--use-env-proxy`, så HTTPS-mailkald følger miljøets netværksproxy.

```sh
npm ci --cache /tmp/finnz-npm-cache --no-audit --no-fund
cp .env.example .env.local
npm run dev -- --port 5173
```

Bevar en eksisterende `.env.local`; overskriv ikke lokale værdier eller hemmeligheder. Vite leverer både siden og `/api/contact` under udvikling. Kontrollér sidens titel og `GET /api/contact` med lokale HTTP-kald. Et svar med `ready: false` betyder, at mailafsendelse endnu ikke er konfigureret.

```sh
npm test
npm run build
npm start
```

`npm start` leverer `dist/` og kontakt-API'et på `PORT` (standard 3000). `npm run preview -- --port 4173` leverer også API'et til lokal produktionskontrol. Processer skal startes igen i nye cloudopgaver. Brug den eksisterende isolerede checkout; opret kun Git-worktrees efter udtrykkeligt ønske.

## Mail og hosting

Modtageren er foreløbig **zfzi@hotmail.com**, bekræftet af brugeren. Telefonnummeret er **+45 41 35 20 25**.

Rigtig afsendelse er implementeret via Resends HTTPS-API. Hosting skal køre Node-serveren eller tilslutte den tilsvarende kontakt-handler; ren statisk hosting af `dist/` kan ikke sende mails. Hostingudbyderen er endnu ikke bekræftet.

1. Opret/brug en Resend-konto og verificér det afsenderdomæne, Finnz råder over.
2. Indtast `RESEND_API_KEY` sikkert som serverhemmelighed. Brug ikke `VITE_` til nøgler.
3. Sæt `CONTACT_FROM_EMAIL` til en adresse på det verificerede domæne og `CONTACT_TO_EMAIL=zfzi@hotmail.com`.
4. Sæt `PUBLIC_SITE_URL` til sitets offentlige origin ved publicering. Standarddomænet til delingsmetadata er brugerens nuværende domæne, `https://xn--finnz-trogdesign-1ob.dk`.
5. `CONTACT_RESPONSE_TIME` er valgfri og vises kun ved aktiveret afsendelse. Sæt kun en svartid, Finnz har bekræftet. Ingen bestemt svartid er aftalt endnu.
6. Sæt kun `TRUST_PROXY=true`, hvis Node-serveren ligger bag en betroet reverse proxy, der tilføjer den rigtige klientadresse i `X-Forwarded-For`. Ellers bruges TCP-adressen til hastighedsbegrænsning.

`VITE_CONTACT_EMAIL` og `VITE_CONTACT_PHONE` er offentlige kontaktoplysninger. Vite-ændringer kræver genstart eller nyt build; serverværdier kræver genstart af serveren.

Der er endnu ingen Resend-nøgle eller verificeret afsender i det klargjorte miljø. En mail er ikke sendt eller leveret under kontrollen. Servertests og browsertests med simulerede svar kontrollerer data, vedhæftninger, fejl, genforsøg og kvittering. Ægte levering skal testes efter aktivering.

## Kontaktformular

`src/contact-form.js` håndterer den fælles formular: navn, e-mail, valgfri opgavetype, opkaldsønske med telefonnummer, omtrentlige mål i cm, besked og billeder/skitser. Native radioknapper og felter understøtter tastatur. Fejl vises ved felterne og i en samlet besked, med fokus på første fejl.

Vedhæftninger: højst fire JPG/PNG/WebP/PDF-filer, 3 MB pr. fil og 8 MB i alt. Billeder får forhåndsvisning, og filer kan fjernes enkeltvis. Serveren validerer også typer, signaturer, antal og størrelser. Filer behandles i hukommelsen og gemmes ikke på serverens disk.

`server/contact.js` validerer og sender til Resend med brugerens e-mail som Reply-To. Backend bruger en skjult spamfælde, kontrol af browserens origin, fem forsøg pr. ti minutter pr. klientadresse pr. serverproces, tidsgrænse og en idempotensnøgle ved genforsøg. Begrænsningen deles ikke mellem flere serverinstanser. HTTP-adapteren afviser også store request bodies.

Formularen viser først “sendt”, når serveren har en bekræftelse med reference fra mailtjenesten; det er ikke en læse- eller leveringskvittering. Fejl bevarer oplysninger og vedhæftninger. Under afsendelse låses felterne mod dobbeltklik. Uden aktiv mailopsætning står der tydeligt, at onlineafsendelse ikke er åbnet, og beskeden kan kun klargøres/kopieres. Vedhæftninger sendes ikke i denne tilstand.

Kladder gemmes lokalt i browseren i syv dage, med mulighed for at slette dem. Navn, e-mail, tekst, telefon, opkaldsønske, opgavetype, mål og farve gendannes. Filer og deres indhold gemmes ikke; efter genindlæsning vises en påmindelse om at vælge dem igen. Kvitteret afsendelse sletter kladden. Lagerfejl forhindrer ikke brug af formularen.

Kontakt fra et projekt åbner oven på projektvinduet. Lukning gendanner fokus og scroll-lås. “Tilpas” lukker begge vinduer og fokuserer farvevalget. En projektreference indsættes kun i en tom besked.

## Farvevælger og navigation

`src/materials.js` viser kun **Lys** og **Sort**, baseret på brugerens afskærmning omkring affaldsbeholdere. Der er intet forudvalgt farveønske. Billederne er vejledende AI-visualiseringer uden løfte om en bestemt træsort eller behandling. En skyder sammenligner billederne i identiske dimensioner; sammenligning vælger ikke en farve på kundens vegne. Farvevalg giver en blød overgang, sender ønsket videre til formularen og ugyldiggør tidligere klargjort output.

`src/ui-enhancements.js` giver projektgalleriet vandret swipe, mens lodret scroll og zoombevægelser bevares. Pilknapper, piletaster og de øvrige billeder virker stadig. Mobilens projektrække har dots, tæller og swipe-hint. Topbjælken bliver kompakt og følger med ved scroll uden at flytte sidens indhold. Billedpladsholdere bevarer layoutet under indlæsning; fejl får en besked. Reduceret bevægelse understøttes.

## Logo, billeder og projekter

- Brug de originale filer i `public/brand/`. Header, footer, intro og kontakt-/projektvinduer bruger `logo-dark.webp`: trætekstur i F'et og sort FINNZ-tekst. Proportionerne og originalfilerne er uændrede.
- F-cursoren og faviconet bruger `mark-outlined.webp`. Favicon er en kvadratisk SVG-wrapper med `preserveAspectRatio="xMidYMid meet"`, genereret af `scripts/generate-favicon.mjs`.
- Gamle SVG-wordmarks har levende tekst med `font-family: Amboy-Black`. De kræver den font. Nye outlined SVG'er skal indeholde bogstavernes paths, før de bruges i stedet for WebP.
- `src/projects.js` indeholder to udførte Finnz-projekter fra brugerens fotos: mørkt havehus og terrasse med træafskærmning, tre AI-redigerede billeder hver. Der opfindes ikke træsort, dimensioner, adresse, kunde eller CVR. PNG-pakker ligger i `downloads/`.
- Galleriet viser alle tre portrætfotos samlet og uden stræk: på desktop det valgte billede lidt større til venstre, to vinkler ved siden af; på mobil hovedbillede og to mindre vinkler. De mindre billeder bytter med hovedbilledet ved klik.
- `src/project-motion.js` animerer kortets billede og papir ind i/ud af projektvinduet. Logo, luk-knap og Escape bruger samme lukning. Lukning under åbning vender animationen; midlertidige lag ryddes op. Materialenavigation lukker straks for at bevare fokus.
- `garden-hero.webp` er en mærket AI-genereret stemningsvisualisering. De tidligere billeder af trælameller og høvlearbejde er bevaret som filer, men vises ikke. Kontaktvinduet viser kun kontaktoplysninger og formular.
- `public/social/finnz-preview.jpg` og Open Graph-/Twitter-metadata giver et delingsbillede. Metadata indeholder absolutte URL'er; bekræft domæne og HTTPS før lancering. Delingstjenester kan cache gamle previews.

Introen vises ved hver indlæsning: normalt minimum 1,1 sek., parathedsfrist 2,2 sek. plus udtoning; reduceret bevægelse minimum 0,35 sek. Interaktion afslutter den. En separat HTML-sikring fjerner den efter fem sekunder ved modulfejl.

## Verifikation

`npm test` kører ti backendtests: validering, filgrænser/signaturer, korrekt mailpayload, Origin/spamfælde, manglende opsætning, mailfejl/genforsøg, hastighedsbegrænsning og HTTP-grænser for store uploads. Testene sender ingen rigtige mails.

Chromiumkontrol omfatter 320/390/768/1440 px, formular og kladdegendannelse, callbacks, opgavetyper, mål, vedhæftninger og fjernelse, simuleret fejlsvar/kvittering, kopiering, farvevalg/-sammenligning, native touch-swipe og lodret scroll, kompakt header, projektanimationer, stablede vinduer, pladsholdere ved langsomme/fejlede billeder, delingsmetadata og fravær af JavaScriptfejl/horisontalt overflow.

Hjemmesiden er ikke deployet. Publicering af cloudmiljøet er ikke publicering af hjemmesiden.
