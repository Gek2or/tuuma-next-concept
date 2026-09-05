# Tuuma Next — Digital Living Concept

Itsenäinen, Finnish-first konseptidemo modernista vuokra-asumisen digipalvelusta. Projekti ei ole Tuuma Kodit Oy:n virallinen sivusto eikä nykyisen sivuston kopio. Se näyttää, miltä integraatiovalmis asiakaskerros voisi näyttää Tampuurin / eTampuurin päällä. Asiakasrajapinta toimii suomeksi, englanniksi ja ruotsiksi; valittu kieli tallentuu laitteelle.

## Mitä demo sisältää

### Arkkitehtuuripäivitys / syyskuu 2026

- `lib/architecture.ts` on yhteinen millimetripohjainen lähde seitsemälle erilaiselle tilaratkaisulle. Pohjapiirustus, 3D-leikkaus ja sisäkierros käyttävät samoja seiniä, aukkoja ja kalusteita.
- Viisi rakennustyyppiä: Kalliolinnan porrastettu 5-kerroksinen talo, Asemanvalon 4-kerroksinen tiilitalo siipiosalla, Ruukinrannan harjakattoinen puuverhoiltu rivitalo, Peltokaarteen 3-kerroksinen harjakattoinen talo ja Keravanjoen pihan puuverhoiltu rivitalo. Rakennukset ovat ulkomuotokonsepteja, eivät toteutussuunnitelmia.
- ARK 101 / pohja ja ARK 201 / periaateleikkaus: A3, 1:50 tulostettuna 100 % koossa. Vektori-SVG-lataus ja selaimen Tulosta/PDF. Akselimitoitus, seinävahvuudet, ikkuna- ja oviaukot, ovikaaret, keittiö, märkätilat, saunat, tilaluettelo ja mittajana.
- Uusi 360°-näkymä on **reaaliaikainen mallinnettu sisäkierros**, ei valokuvapanoraama. Vanhat matalaresoluutioiset panoraamat eivät enää pyöri huoneiden korvikkeina. Jokainen huone avaa oman kamerapaikan yhteisessä mallissa.
- Kalustettu/tyhjä ja Nordic/Clay/Forest toimivat sekä 3D-leikkauksessa että sisäkierroksessa. Tyhjä säilyttää kiintokalusteet. Näkymien säätimet ovat erillisiä.
- WebGL2, kosketus-/hiirikatse, nuolinäppäimet, huonenavigointi, ovien hotspotit, todellinen pohjakartta ja selaimen fullscreen. Ei teeskenneltyä gyro-painiketta.
- Renderöinti käynnistyy vasta näkymän lähellä ja pysähtyy sen poistuessa ruudulta. Ei ulkoista HDRI-latausta. Ilman WebGL2-tukea esitetään piirustus ja selkeä ilmoitus.

**Rajat:** malleissa on proseduraaliset materiaalit ja mallinnetut kalusteet; ne eivät ole valokuvarealistisia laserkeilauksia tai oikean kohteen mittausaineistoa. Vanhemmat konseptivalokuvat havainnollistavat tunnelmaa eivätkä todista uuden tilamallin mittoja. Huoneluettelon pinta-alat ovat suuntaa-antavia, eivät SFS-standardin mukaisesti varmennettuja huoneistoaloja; katalogin ilmoitusala ja luonnoksen tilapinta-ala voivat poiketa. Rakenteet, paloturvallisuus, esteettömyys, ikkunamitoitus ja rakennuspaikan kaava tulee tarkistaa pätevän suunnittelijan kanssa ennen käyttöä oikean kohteen asiakirjoina.

Suunnittelun taustaviitteet: [YM asuin-, majoitus- ja työtilat 631/2024](https://www.finlex.fi/fi/lainsaadanto/saadoskokoelma/2024/631), [suunnitelmat ja selvitykset 216/2015](https://www.finlex.fi/fi/lainsaadanto/saadoskokoelma/2015/216), [Ympäristöministeriön rakentamismääräykset](https://ym.fi/rakentamismaaraykset). Viittaukset eivät ole vaatimustenmukaisuusvakuutus.

Geometriatarkistus: `node --experimental-strip-types --test tests/architecture.test.mjs` tarkistaa seitsemän uniikkia pohjaa, huoneiden päällekkäisyydettömyyden, kulkuyhteydet, sisäänkäynnit, makuuhuoneiden ikkunat, kalusteiden sijainnin huoneen sisällä ja saunojen yhteyden pesuhuoneeseen. GPU-renderöinnin visuaalinen tarkistus on tehtävä WebGL2-laitteella; agentin testiselaimessa WebGL on pois käytöstä.

### Palvelutoiminnot

- älykäs, vaiheittainen Smart Home Matcher ja perustellut match-tulokset
- moderni asuntohaku, mobiilisuodattimet (alue, vuokra, huoneet, pinta-ala, talotyyppi, varusteet), lajittelu, karttanäkymä, suosikit ja 2–3 asunnon vertailu
- Kalliolinna Digital Concept: kevyt 3D-rakennus, kerros- ja asuntovalitsin
- mitoitettu, klikattava SVG-pohjapiirros kaikille demoasunnoille (A12, A14, B24, C07, A31, D18, E05)
- teksturoitu 3D-dollhouse: puu- ja laattapinnat, julkisivun materiaalivariantit, valittava sisustustyyli sekä tyhjä / kalustettu tila
- asunnon tietosivu, media, varusteet ja hakemuksen Tampuuri-handoff-konsepti
- reaaliaikainen Three.js-sisäkierros: huonenavigointi, hotspotit, pohjakartta, fullscreen, näppäimistö ja touch
- apartment-specific media: jokaisella demoasunnolla oma korkearesoluutioinen kalustettu ja tyhjä kansikuva, galleria, 2:1-panoraama ja eri material palette
- alkuperäinen Nordic editorial -kuvitus Hyrylään, Jokelaan ja Kellokoskelle sekä paikalliset 2:1-konseptipanoraamat `public/art`-hakemistossa
- hyväksyttyihin ohjeisiin rajattu `Kysy Tuumalta` -asukasapuri
- apurin lähteet, tarkistuspäivä, epävarman vastauksen fallback ja kiiretilanteiden guardrail
- tilanteisiin perustuva asukkaan palvelukeskus
- `/hakemukseni`: hakemuksen tila, puuttuvat tiedot, voimassaolo ja selkeä match-vastuuvapauslauseke
- `/oma-koti`: vuokra, sopimukset, talotiedotteet, varaukset, pysäköinti ja omat yhteystiedot
- `/huolto`: kuvallinen Huolto Live -pyyntö, kiireellisyysarvio, yleisavainsuostumus, ETA, viestit ja palaute
- `/kustannukset`: täysi kuukausi- ja muuttoarvion demo (vesimalli, energia, pysäköinti / EV, sauna, vakuutus, juna / auto, vakuus, tukihyvitys, vuosinäkymä)
- asuntohaun paikallinen hakuhälytysprofiili
- `/energia`: energiatodistus, sisäilman tilanne, historia ja digitaalisen huoltokirjan konsepti
- `/muutto`: sisään- ja poismuuton tarkistuslistat, avainaika ja kuvallinen kuntodokumentointi
- Hyrylän, Jokelan ja Kellokosken aluekokemukset
- henkilöstön demo-näkymä julkaisutiloineen, sisältölaadulla, huollon SLA-signaaleilla, AI-ohjejonolla, 360°-workflow'lla ja analytiikkafunnelilla
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

Kaikki asunnot, hinnat, saatavuudet, analytiikka, hakemukset, huoltopyynnöt, energiamittaukset ja asukastiedot ovat mock-dataa. Asuntojen valokuvat ja alkuperäinen editorial-kuvitus ovat konseptikuvia. Lomakkeet eivät lähetä tietoja, tiedostot eivät siirry palvelimelle ja AI-apuri ei kutsu ulkoista kielimallia. Uusi sisäkierros renderöi asuntokohtaisen tilamallin. Vanhat 2:1-panoraamat ja ApartmentTour-tietomalli on säilytetty tulevaa aidon kuvausaineiston integraatiota varten, mutta niitä ei käytetä nykyisessä kierroskomponentissa. Oikeat valokuvapanoraamat tarvitsevat erillisen panoraamaviewerin ja huonekohtaiset mediaresurssit. Materiaalit ovat proseduraalisia WebGL-pintoja; tuotannollinen glTF/GLB-tuonti tarvitsee vielä erillisen lataus- ja validointikerroksen.

Suosikit tallennetaan selaimen `localStorage`en ilman kirjautumista. Tuotannossa ne voidaan synkronoida asukastiliin. 3D ladataan client-side-komponenttina; vanhemmille laitteille voidaan tarjota optimoitu still-kuva.

## Integraatioarkkitehtuuri

`lib/providers.ts` erottaa käyttöliittymän taustajärjestelmistä:

- `PropertyProvider` — kohteet, asunnot ja saatavuus
- `ApplicationProvider` — hakemuksen aloitus ja asuntotunnuksen handoff
- `MaintenanceProvider` — huoltopyynnöt
- `AnalyticsProvider` — suostumuspohjaiset tapahtumat
- `TampuuriAdapter` — tuleva API-/linkki-integraatio Tampuuriin
- `ResidentProvider` — asukkaan yhteenveto
- `BookingProvider` — sauna-, tila- ja pysäköintivaraukset
- `NotificationProvider` — hakuhälytysprofiilit
- `EnergyProvider` — asunto- ja talotason energia- ja sisäilmadata

Ensimmäinen tuotantointegraatio voi olla kevyt: asuntohaku saa datan rajapinnasta ja hakemus siirtyy nykyiseen Tampuuri-prosessiin esitäytetyllä asuntotunnuksella. Samaa provider-rajapintaa käyttäen taustajärjestelmän voi myöhemmin vaihtaa ilman käyttöliittymän uudelleenrakennusta.

## Jatkokehitys

1. Tampuurin rajapintojen ja tietomallin kartoitus.
2. Oikea media- ja 360°-julkaisupipeline.
3. WCAG-auditointi, suorituskykybudjetit ja analytiikkasuostumukset.
4. Tietopohjaisen asukasapurin hyväksyntä-, lähde- ja palauteprosessi.
5. Henkilöstöroolit, luonnokset, hyväksyntä ja audit log.
6. Tuotannollinen hakemus- ja huoltohandoff, virhetilat ja monitorointi.
7. Kielisisällön hallinta suomeksi, englanniksi ja ruotsiksi.
8. Tietosuojavaikutusten arviointi, suostumukset ja säilytysajat.

## Julkaisu

Projekti on tavallinen Next.js-sovellus ja voidaan viedä GitHubiin sekä julkaista Verceliin. Cloudflare-ympäristössä projekti käyttää Vinext/Vite Worker -buildia. Staattinen Pages-export voidaan lisätä erillisenä deployment-profiilina, jos kaikki integraatiot pidetään client-side-muodossa.
