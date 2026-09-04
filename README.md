# Tuuma Next — Digital Living Concept

Itsenäinen, Finnish-first konseptidemo modernista vuokra-asumisen digipalvelusta. Projekti ei ole Tuuma Kodit Oy:n virallinen sivusto eikä nykyisen sivuston kopio. Se näyttää, miltä integraatiovalmis asiakaskerros voisi näyttää Tampuurin / eTampuurin päällä.

## Mitä demo sisältää

- älykäs, vaiheittainen Smart Home Matcher ja perustellut match-tulokset
- moderni asuntohaku, mobiilisuodattimet, karttanäkymä, suosikit ja 2–3 asunnon vertailu
- Kalliolinna Digital Concept: kevyt 3D-rakennus, kerros- ja asuntovalitsin
- asunnon tietosivu, media, varusteet ja hakemuksen Tampuuri-handoff-konsepti
- 360°-kierroksen room navigator, hotspot, fullscreen ja pohjakartan minimappi
- hyväksyttyihin ohjeisiin rajattu `Kysy Tuumalta` -asukasapuri
- tilanteisiin perustuva asukkaan palvelukeskus
- Hyrylän, Jokelan ja Kellokosken aluekokemukset
- henkilöstön demo-näkymä julkaisutiloineen, 360°-workflow ja analytiikkafunneli
- `/concept`-sivu johdolle: haaste → mahdollisuus → ratkaisu → arvo
- PWA-manifesti, service worker, metadata, Schema.org ja saavutettavuuden perusrakenne

## Käynnistä paikallisesti

Vaatimus: Node.js 22.13+.

```bash
npm install
npm run dev
```

Tuotantobuild: `npm run build`.

## Demo-data ja rajaukset

Kaikki asunnot, hinnat, saatavuudet, analytiikka ja asukastiedot ovat mock-dataa. Kuvat ovat konseptikuvia. Lomakkeet eivät lähetä tietoja, AI-apuri ei kutsu ulkoista kielimallia ja 360°-kierros demonstroi lopullista käyttöliittymää tavallisilla demo-kuvilla.

Suosikit tallennetaan selaimen `localStorage`en ilman kirjautumista. Tuotannossa ne voidaan synkronoida asukastiliin. 3D ladataan client-side-komponenttina; vanhemmille laitteille voidaan tarjota optimoitu still-kuva.

## Integraatioarkkitehtuuri

`lib/providers.ts` erottaa käyttöliittymän taustajärjestelmistä:

- `PropertyProvider` — kohteet, asunnot ja saatavuus
- `ApplicationProvider` — hakemuksen aloitus ja asuntotunnuksen handoff
- `MaintenanceProvider` — huoltopyynnöt
- `AnalyticsProvider` — suostumuspohjaiset tapahtumat
- `TampuuriAdapter` — tuleva API-/linkki-integraatio Tampuuriin

Ensimmäinen tuotantointegraatio voi olla kevyt: asuntohaku saa datan rajapinnasta ja hakemus siirtyy nykyiseen Tampuuri-prosessiin esitäytetyllä asuntotunnuksella. Samaa provider-rajapintaa käyttäen taustajärjestelmän voi myöhemmin vaihtaa ilman käyttöliittymän uudelleenrakennusta.

## Jatkokehitys

1. Tampuurin rajapintojen ja tietomallin kartoitus.
2. Oikea media- ja 360°-julkaisupipeline.
3. WCAG-auditointi, suorituskykybudjetit ja analytiikkasuostumukset.
4. Tietopohjainen asukasapuri lähdeviitteillä ja palauteprosessilla.
5. Henkilöstöroolit, luonnokset, hyväksyntä ja audit log.
6. Tuotannollinen hakemushandoff, virhetilat ja monitorointi.

## Julkaisu

Projekti on tavallinen Next.js-sovellus ja voidaan viedä GitHubiin sekä julkaista Verceliin. Cloudflare-ympäristössä projekti käyttää Vinext/Vite Worker -buildia. Staattinen Pages-export voidaan lisätä erillisenä deployment-profiilina, jos kaikki integraatiot pidetään client-side-muodossa.
