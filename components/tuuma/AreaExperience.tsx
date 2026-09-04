"use client";

import { MapPin, School, ShoppingBag, Trees, TrainFront, Waves } from "lucide-react";
import { useLanguage, type LocalizedText } from "./LanguageProvider";

type Area = {
  name: string;
  sub: LocalizedText;
  img: string;
  facts: Array<[typeof School, LocalizedText]>;
  distance: LocalizedText;
  detail: LocalizedText;
};

const areas: Area[] = [
  {
    name: "Hyrylä",
    sub: { fi: "Palvelut lähellä, järvi ja luonto ympärillä", en: "Services close by, lake and nature around you", sv: "Service nära, sjö och natur runt hörnet" },
    img: "/art/tuusula-editorial-area.webp",
    facts: [[School, { fi: "Päiväkodit ja koulut kävelyetäisyydellä", en: "Schools and day care within walking distance", sv: "Skolor och daghem på gångavstånd" }], [ShoppingBag, { fi: "Kattavat arjen palvelut", en: "Everyday services close by", sv: "Vardagsservice nära" }], [Waves, { fi: "Tuusulanjärven rantareitit", en: "Tuusulanjärvi lakeside trails", sv: "Strandstigar vid Tusby träsk" }]],
    distance: { fi: "8 min pyörällä keskustaan · 12 min järvelle", en: "8 min by bike to the centre · 12 min to the lake", sv: "8 min med cykel till centrum · 12 min till sjön" },
    detail: { fi: "Hyrylän kodit yhdistävät kunnan palvelut ja rauhallisen pihan. Näkymät, esteetön kulku ja joustava etätyötila voidaan tuoda samaan asuntoesittelyyn.", en: "Hyrylä homes combine municipal services with a calm courtyard. Views, step-free access and a flexible work corner can live in the same property story.", sv: "Bostäder i Hyrylä kombinerar kommunal service med en lugn gård. Utsikt, stegfri tillgång och flexibel arbetsplats ryms i samma presentation." },
  },
  {
    name: "Jokela",
    sub: { fi: "Sujuva junayhteys ja kylämäinen arki", en: "A smooth rail connection and village-like everyday life", sv: "Smidig tågförbindelse och bykänsla" },
    img: "/art/jokela-editorial-area.webp",
    facts: [[TrainFront, { fi: "Juna-asema lähellä", en: "Train station nearby", sv: "Tågstation nära" }], [School, { fi: "Palvelut perheille", en: "Services for families", sv: "Service för familjer" }], [Trees, { fi: "Väljät ulkoilureitit", en: "Open routes for walking and cycling", sv: "Luftiga gång- och cykelvägar" }]],
    distance: { fi: "4 min asemalle · noin 35 min Helsinkiin junalla", en: "4 min to the station · about 35 min to Helsinki by train", sv: "4 min till stationen · cirka 35 min till Helsingfors med tåg" },
    detail: { fi: "Jokelan asuntojen suunnittelussa arjen rytmi näkyy säilytyksessä, parvekkeessa ja nopeassa kulussa asemalle. 360-kierros voi nostaa esiin myös pyöräpaikat ja yhteiset tilat.", en: "In Jokela, daily rhythm shows in storage, balconies and a quick route to the station. A 360 tour can also highlight bike spaces and shared areas.", sv: "I Jokela syns vardagsrytmen i förvaring, balkonger och den snabba vägen till stationen. En 360-rundtur kan lyfta cykelplatser och gemensamma utrymmen." },
  },
  {
    name: "Kellokoski",
    sub: { fi: "Rauhallinen ruukkimiljöö joen äärellä", en: "A quiet works village beside the river", sv: "Lugnt brukssamhälle vid ån" },
    img: "/art/kellokoski-editorial-area.webp",
    facts: [[Trees, { fi: "Keravanjoki ja metsäpolut", en: "Keravanjoki river and forest paths", sv: "Kervo å och skogsstigar" }], [ShoppingBag, { fi: "Arjen lähipalvelut", en: "Local everyday services", sv: "Lokal vardagsservice" }], [School, { fi: "Koulu ja päiväkoti kylän ytimessä", en: "School and day care at the heart of the village", sv: "Skola och daghem i byns centrum" }]],
    distance: { fi: "6 min kävellen joelle · 14 min pyörällä palveluihin", en: "6 min walk to the river · 14 min by bike to services", sv: "6 min till ån · 14 min med cykel till service" },
    detail: { fi: "Kellokosken kodeissa ulkotila on osa pohjapiirrosta: oma piha, varasto ja luonnonvalo näkyvät jo ennen näyttöä. Materiaalit voivat jatkaa ruukin tiilen ja männyn sävyjä.", en: "In Kellokoski, outdoor space is part of the floor plan: a private yard, storage and daylight are visible before the viewing. Materials can echo brick and pine.", sv: "I Kellokoski är uteplatsen en del av planritningen: egen gård, förråd och dagsljus syns före visningen. Materialen kan spegla tegel och furu." },
  },
];

const copy = {
  eyebrow: { fi: "Alueet", en: "Areas", sv: "Områden" },
  title: { fi: "Koti on myös kaikki se, mitä oven ulkopuolella on.", en: "A home is also everything outside the front door.", sv: "Ett hem är också allt som finns utanför dörren." },
  intro: { fi: "Vertaa arjen matkoja, palveluja, kouluja ja luontoa — ennen kuin valitset asunnon.", en: "Compare everyday routes, services, schools and nature before choosing a home.", sv: "Jämför vardagsresor, service, skolor och natur innan du väljer bostad." },
  map: { fi: "Arjen kartta", en: "Everyday map", sv: "Vardagskarta" },
  mapBody: { fi: "Reittiajat, joukkoliikenne ja lähipalvelut voidaan tuoda kartalle avoimista rajapinnoista.", en: "Routes, public transport and local services can be brought into the map from open data sources.", sv: "Rutter, kollektivtrafik och lokal service kan hämtas till kartan från öppna datakällor." },
  standard: { fi: "Suomalaisen kodin perusasiat", en: "Finnish home standards", sv: "Grunder för ett finländskt hem" },
  standardBody: { fi: "Sama aluekokemus jatkuu kohdesivulla: energialuokka, esteetön kulku, märkätilan mitoitus, ilmanvaihto, säilytys ja tietoliikenne näkyvät vertailukelpoisina tietoina.", en: "The same area story continues on each property page: energy, access, wet-room dimensions, ventilation, storage and connectivity are shown as comparable data.", sv: "Samma områdesberättelse fortsätter på objektsidan: energi, tillgänglighet, våtrum, ventilation, förvaring och uppkoppling visas som jämförbar data." },
};

export function AreaExperience() {
  const { text } = useLanguage();
  return <main id="main" className="shell py-12 sm:py-20"><p className="eyebrow">{text(copy.eyebrow)}</p><h1 className="display mt-4 max-w-4xl text-5xl sm:text-7xl">{text(copy.title)}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[#5e748b]">{text(copy.intro)}</p><div className="mt-12 grid gap-6">{areas.map((area, index) => <article key={area.name} className="grid overflow-hidden rounded-[32px] bg-white shadow-[0_15px_50px_rgba(20,52,84,.07)] md:grid-cols-2"><img src={area.img} alt={`${area.name}, ${text({ fi: "asumisen ympäristö", en: "living environment", sv: "boendemiljö" })}`} className={`h-80 w-full object-cover md:h-full ${index % 2 ? "md:order-2" : ""}`} /><div className="p-7 sm:p-10"><p className="eyebrow">Tuusula</p><h2 className="display mt-3 text-5xl">{area.name}</h2><p className="mt-3 text-lg text-[#5f748a]">{text(area.sub)}</p><p className="mt-5 text-sm leading-6 text-[#61778b]">{text(area.detail)}</p><div className="mt-8 grid gap-3">{area.facts.map(([Icon, label]) => <div key={label.fi} className="flex items-center gap-3 rounded-2xl bg-[#eff5fa] p-4 font-bold"><Icon className="text-[#0a55df]" size={20} />{text(label)}</div>)}</div><div className="mt-8 rounded-2xl bg-[#dfeeff] p-5"><div className="flex items-center gap-2 font-black"><MapPin size={18} />{text(copy.map)}</div><p className="mt-3 text-sm font-bold leading-6 text-[#506b86]">{text(area.distance)}</p><p className="mt-2 text-sm leading-6 text-[#506b86]">{text(copy.mapBody)}</p></div></div></article>)}</div><section className="mt-10 grid gap-6 rounded-[30px] border border-[#d8cda9] bg-[#f4ecd8] p-7 sm:p-10 md:grid-cols-[.8fr_1.2fr] md:items-center"><div><p className="eyebrow text-[#7f6526]">Region ready</p><h2 className="display mt-3 text-4xl text-[#173655] sm:text-5xl">{text(copy.standard)}</h2></div><p className="text-base leading-8 text-[#617487]">{text(copy.standardBody)}</p></section></main>;
}
