"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Bot,
  Building2,
  ChartNoAxesCombined,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Languages,
  Layers3,
  Leaf,
  Repeat2,
  Smartphone,
  UsersRound,
  Wrench,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function ConceptStory() {
  const { text } = useLanguage();
  const additions = [
    [ClipboardCheck, { fi: "Hakemuksen seuranta", en: "Application tracking", sv: "Ansökningsuppföljning" }, { fi: "Tila, puuttuvat tiedot ja voimassaolo ilman uutta yhteydenottoa.", en: "Status, missing details and validity without another support request.", sv: "Status, saknade uppgifter och giltighet utan ny kontakt." }, "/hakemukseni"],
    [Building2, { fi: "Oma koti", en: "My home", sv: "Mitt hem" }, { fi: "Maksut, sopimus, tiedotteet, varaukset ja omat palvelut.", en: "Payments, lease, notices, bookings and resident services.", sv: "Betalningar, avtal, meddelanden, bokningar och boendetjänster." }, "/oma-koti"],
    [Wrench, { fi: "Huolto Live", en: "Maintenance Live", sv: "Service Live" }, { fi: "Ohjattu ilmoitus, media, arvioitu aika ja seurattava tila.", en: "Guided reporting, media, estimated visit and live status.", sv: "Guidad anmälan, media, uppskattad tid och status." }, "/huolto"],
    [CircleDollarSign, { fi: "Kokonaiskustannus", en: "Total monthly cost", sv: "Total månadskostnad" }, { fi: "Vuokra, vesi, energia, pysäköinti, sauna ja liikkuminen.", en: "Rent, water, energy, parking, sauna and travel.", sv: "Hyra, vatten, energi, parkering, bastu och resor." }, "/kustannukset"],
    [Bell, { fi: "Hakuhälytykset", en: "Search alerts", sv: "Sökbevakningar" }, { fi: "Toiveet tallentuvat ja uusi sopiva koti voidaan ilmoittaa heti.", en: "Saved preferences make timely matching notifications possible.", sv: "Sparade önskemål möjliggör snabba meddelanden om matchande bostäder." }, "/kohteet"],
    [Bot, { fi: "Luotettava AI-apuri", en: "Grounded AI assistant", sv: "Tillförlitlig AI-assistent" }, { fi: "Hyväksytyt lähteet, tarkistuspäivä, turvallinen fallback ja ihmisen handoff.", en: "Approved sources, review dates, safe fallback and human handoff.", sv: "Godkända källor, granskningsdatum, säkert fallback och mänsklig överlämning." }, "/"],
    [Leaf, { fi: "Energia ja sisäilma", en: "Energy and indoor climate", sv: "Energi och inomhusklimat" }, { fi: "Ymmärrettävät mittaukset, energiatodistus ja tulevat parannukset.", en: "Readable measurements, energy certificate and planned improvements.", sv: "Tydliga mätningar, energicertifikat och planerade förbättringar." }, "/energia"],
    [Languages, { fi: "Kolmikielinen palvelu", en: "Three-language service", sv: "Tjänst på tre språk" }, { fi: "Suomi ensin, English ja Svenska samalla komponenttiarkkitehtuurilla.", en: "Finnish-first, with English and Swedish in the same architecture.", sv: "Finska först, med engelska och svenska i samma arkitektur." }, "/"],
  ] as const;

  const values = [
    [UsersRound, { fi: "Vähemmän toistuvia yhteydenottoja", en: "Fewer repetitive contacts", sv: "Färre upprepade kontakter" }, { fi: "Ohjattu asiointi vapauttaa aikaa tilanteisiin, joissa tarvitaan ihmistä.", en: "Guided service frees time for cases that need a person.", sv: "Guidad service frigör tid för ärenden som behöver en människa." }],
    [Layers3, { fi: "Parempi esittely kodeille", en: "Better presentation of homes", sv: "Bättre presentation av bostäder" }, { fi: "3D, 360°, aluekokemus ja kustannusnäkymä tukevat päätöksiä ennen näyttöä.", en: "3D, 360°, area context and total cost support decisions before a viewing.", sv: "3D, 360°, områdesinformation och totalkostnad stödjer beslut före visning." }],
    [Smartphone, { fi: "Sujuva mobiilikokemus", en: "Stronger mobile experience", sv: "Smidigare mobilupplevelse" }, { fi: "Haku, vertailu, muutto ja huolto toimivat yhdellä kädellä.", en: "Search, comparison, moving and maintenance work one-handed.", sv: "Sökning, jämförelse, flytt och service fungerar med en hand." }],
    [Repeat2, { fi: "Jatkuva kehittäminen", en: "Continuous development", sv: "Kontinuerlig utveckling" }, { fi: "Asiakaskerrosta voidaan parantaa vaiheittain ilman suurta järjestelmävaihtoa.", en: "The customer layer can improve gradually without a major system replacement.", sv: "Kundlagret kan förbättras stegvis utan ett stort systembyte." }],
    [ChartNoAxesCombined, { fi: "Parempi tilannekuva", en: "Better operational insight", sv: "Bättre lägesbild" }, { fi: "Haku-, sisältö- ja palvelusignaalit tukevat käytännön päätöksiä.", en: "Search, content and service signals support practical decisions.", sv: "Sök-, innehålls- och servicesignaler stödjer praktiska beslut." }],
    [CheckCircle2, { fi: "Laatu ennen julkaisua", en: "Quality before publishing", sv: "Kvalitet före publicering" }, { fi: "Puuttuvat kuvat, pohjat, alt-tekstit ja tiedot löytyvät ajoissa.", en: "Missing media, floor plans, alt text and data are found early.", sv: "Saknade bilder, planritningar, alt-texter och uppgifter hittas i tid." }],
  ] as const;

  return (
    <main id="main">
      <section className="relative overflow-hidden bg-[#0d2e50] py-20 text-white sm:py-28">
        <div className="absolute inset-0 opacity-20 soft-grid" />
        <div className="shell relative">
          <p className="eyebrow !text-[#92b9df]">Tuuma Digital Living Concept</p>
          <h1 className="display mt-6 max-w-5xl text-5xl leading-[1.02] sm:text-7xl">
            {text({ fi: "Modernisoidaan asiakaskokemus ilman, että nykyisiä taustajärjestelmiä tarvitsee rakentaa uudelleen.", en: "Modernise the customer experience without rebuilding the existing back-office systems.", sv: "Modernisera kundupplevelsen utan att bygga om de befintliga bakgrundssystemen." })}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#c4d7e9]">
            {text({ fi: "Tuuma Next on integraatiovalmis asiakaslayer Tampuurin ja eTampuurin päälle — ei niiden korvaaja.", en: "Tuuma Next is an integration-ready customer layer on top of Tampuuri and eTampuuri — not their replacement.", sv: "Tuuma Next är ett integrationsklart kundlager ovanpå Tampuuri och eTampuuri — inte en ersättare." })}
          </p>
        </div>
      </section>

      <section className="shell py-20">
        <div className="grid gap-4 lg:grid-cols-4">
          {[
            ["01", "Current challenge", text({ fi: "Tieto on hajallaan ja käyttäjä joutuu tuntemaan organisaation rakenteen.", en: "Information is fragmented and users need to understand the organisation.", sv: "Informationen är splittrad och användaren måste förstå organisationen." })],
            ["02", "Digital opportunity", text({ fi: "Yksi palvelu voi ohjata kodin etsijää ja asukasta tilanteen mukaan.", en: "One service can guide applicants and residents according to their situation.", sv: "En tjänst kan guida bostadssökande och boende enligt situationen." })],
            ["03", "Proposed solution", text({ fi: "Moderni frontend yhdistää haun, asioinnin, sisällön ja analytiikan.", en: "A modern frontend joins search, services, content and analytics.", sv: "Ett modernt gränssnitt förenar sökning, tjänster, innehåll och analys." })],
            ["04", "Business value", text({ fi: "Parempi asiakaskokemus ja sujuvampi henkilöstötyö ilman isoa järjestelmävaihtoa.", en: "Better customer experience and smoother staff work without a major system replacement.", sv: "Bättre kundupplevelse och smidigare personalarbete utan ett stort systembyte." })],
          ].map((item, index) => (
            <article key={item[0]} className={"rounded-[28px] p-7 " + (index === 2 ? "bg-[#0a55df] text-white" : "bg-white")}>
              <span className={"text-xs font-black " + (index === 2 ? "text-[#cfe0ff]" : "text-[#0a55df]")}>{item[0]}</span>
              <h2 className="mt-10 text-lg font-black">{item[1]}</h2>
              <p className={"mt-3 text-sm leading-6 " + (index === 2 ? "text-[#e3edff]" : "text-[#60748a]")}>{item[2]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#e5f0fb] py-20">
        <div className="shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Next-generation service layer</p>
            <h2 className="display mt-4 text-5xl">{text({ fi: "Markkinan parhaat ideat yhtenä palveluna", en: "Modern market patterns in one service", sv: "Moderna marknadslösningar i en tjänst" })}</h2>
            <p className="mt-5 leading-7 text-[#5d7389]">{text({ fi: "Lisäykset muodostavat jatkuvan polun kodin löytämisestä asumisen arkeen ja henkilöstön työhön.", en: "The additions form a continuous journey from home search to everyday living and staff operations.", sv: "Tilläggen bildar en sammanhängande resa från bostadssökning till boendevardag och personalarbete." })}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {additions.map(([Icon, title, body, href]) => (
              <Link key={title.fi} href={href} className="group rounded-[26px] bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
                <Icon className="text-[#0a55df]" />
                <h3 className="mt-6 font-black">{text(title)}</h3>
                <p className="mt-3 text-sm leading-6 text-[#60748a]">{text(body)}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0a55df]">{text({ fi: "Avaa demo", en: "Open demo", sv: "Öppna demo" })}<ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-20">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="eyebrow">Business value</p>
            <h2 className="display mt-4 text-5xl">{text({ fi: "Arvo syntyy kitkan poistamisesta.", en: "Value comes from removing friction.", sv: "Värde skapas när friktion tas bort." })}</h2>
            <p className="mt-5 leading-7 text-[#5d7389]">{text({ fi: "Konsepti ei lupaa keksittyjä prosentteja. Se näyttää mitattavat kohdat, joita voidaan kehittää ja seurata.", en: "The concept avoids invented percentages and identifies measurable moments for improvement.", sv: "Konceptet lovar inga påhittade procentsatser utan visar mätbara förbättringspunkter." })}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map(([Icon, title, body]) => <article key={title.fi} className="rounded-[26px] bg-white p-6"><Icon className="text-[#0a55df]" /><h3 className="mt-5 font-black">{text(title)}</h3><p className="mt-3 text-sm leading-6 text-[#60748a]">{text(body)}</p></article>)}
          </div>
        </div>
      </section>

      <section className="shell pb-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div><p className="eyebrow">Integration-ready</p><h2 className="display mt-4 text-5xl">{text({ fi: "Selkeä rajapinta nykyisiin järjestelmiin", en: "A clear boundary to existing systems", sv: "En tydlig gräns mot befintliga system" })}</h2><p className="mt-5 leading-7 text-[#5d7389]">{text({ fi: "Frontend käyttää provider-rajapintoja. Demo palauttaa mock-dataa; tuotannossa adapteri voidaan vaihtaa ilman käyttöliittymän uudelleenrakennusta.", en: "The frontend uses provider interfaces. Production adapters can replace mock data without rebuilding the interface.", sv: "Gränssnittet använder provider-kontrakt. Produktionsadaptrar kan ersätta mockdata utan ombyggnad." })}</p></div>
          <div className="rounded-[30px] bg-[#102e4e] p-7 text-white"><div className="grid gap-3">{["PropertyProvider → homes & availability", "ApplicationProvider → handoff & status", "MaintenanceProvider → requests & SLA", "AnalyticsProvider → consent-based signals", "TampuuriAdapter → existing back office"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/8 p-4"><CheckCircle2 size={18} className="text-[#73b5ff]" /><span className="text-sm font-bold">{item}</span>{index < 4 && <ArrowRight size={15} className="ml-auto text-[#8aa8c6]" />}</div>)}</div></div>
        </div>
      </section>
    </main>
  );
}
