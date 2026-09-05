"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accessibility,
  ArrowRight,
  Box,
  Building2,
  Car,
  ChevronRight,
  Expand,
  Heart,
  MapPin,
  PawPrint,
  Share2,
  Sparkles,
  Wifi,
} from "lucide-react";
import { apartments } from "@/lib/data";
import { useLanguage, type LocalizedText } from "./LanguageProvider";
import { ApartmentPlan } from "./ApartmentPlan";
import { ApartmentGallery } from "./ApartmentGallery";

const BuildingScene = dynamic(() => import("./BuildingScene"), { ssr: false });
const ApartmentDollhouse = dynamic(() => import("./ApartmentDollhouse"), { ssr: false });
const Tour360Viewer = dynamic(() => import("./Tour360Viewer"), {
  ssr: false,
  loading: () => <div className="grid min-h-[520px] place-items-center rounded-[30px] bg-[#0a223d] text-sm font-bold text-white/70">360°‑kierros latautuu…</div>,
});

const units = apartments.map((item) => ({
  id: item.id,
  r: `${item.rooms}H+KT`,
  s: `${item.size.toString().replace(".", ",")} m²`,
  rent: item.rent,
  free: !item.available.toLowerCase().includes("varattu"),
  availability: item.available,
}));

const buildingPrinciples = [
  { title: { fi: "Lämmön talteenotto", en: "Heat recovery", sv: "Värmeåtervinning" }, body: { fi: "Koneellinen tulo- ja poistoilma tukee tasaista sisäilmaa ja energiatehokkuutta.", en: "Balanced mechanical ventilation supports stable indoor climate and energy efficiency.", sv: "Balanserad ventilation stöder ett jämnt inomhusklimat och energieffektivitet." } },
  { title: { fi: "Kuivat märkätilat", en: "Durable wet rooms", sv: "Hållbara våtrum" }, body: { fi: "Selkeä mitoitus, pesutorni-varaus ja helposti huollettavat pinnat.", en: "Clear dimensions, washer-dryer provision and easy-to-maintain surfaces.", sv: "Tydliga mått, förberedelse för tvättmaskin och lättskötta ytor." } },
  { title: { fi: "Esteetön arki", en: "Accessible everyday life", sv: "Tillgänglig vardag" }, body: { fi: "Kynnysten, hissin, sisäänkäynnin ja pihareitin tiedot näkyvät jo ennen hakemusta.", en: "Thresholds, lift, entrance and yard route are visible before applying.", sv: "Trösklar, hiss, entré och gårdsrutt syns före ansökan." } },
  { title: { fi: "Arjen säilytys", en: "Everyday storage", sv: "Förvaring för vardagen" }, body: { fi: "Ulkoiluvälineet, lastenvaunut ja pyörät kuuluvat samaan digitaaliseen kohdekuvaukseen.", en: "Outdoor gear, prams and bikes belong in the same digital property story.", sv: "Utrustning, barnvagnar och cyklar ingår i samma digitala objektberättelse." } },
];

const pageCopy = {
  addressLead: { fi: "uusi tapa kokea koti ennen hakemusta.", en: "a new way to experience a home before applying.", sv: "ett nytt sätt att uppleva bostaden före ansökan." },
  chooseFloor: { fi: "Valitse kerros", en: "Choose a floor", sv: "Välj våning" },
  digitalShowcase: { fi: "Kohteen digitaalinen esittely", en: "Digital property showcase", sv: "Digital objektvisning" },
  showcaseBadges: { fi: "Pohja · 3D · 360°", en: "Plan · 3D · 360°", sv: "Plan · 3D · 360°" },
  selectHome: { fi: "valitse koti", en: "choose a home", sv: "välj bostad" },
  heroTitle: { fi: "Koti, jonka voit tuntea jo nyt.", en: "A home you can feel already.", sv: "Ett hem du kan känna redan nu." },
  heroIntro: { fi: "Avaa asunto, tutki pohjaa, vaihda sisustusta, pyöritä 3D‑mallia ja astu sisään virtuaalikierroksella.", en: "Open the home, explore the plan, change the interior, rotate the 3D model and step inside the virtual tour.", sv: "Öppna bostaden, utforska planen, byt inredning, rotera 3D-modellen och kliv in i rundturen." },
  selectedHome: { fi: "Valittu koti", en: "Selected home", sv: "Vald bostad" },
  exploreHome: { fi: "Tutustu asuntoon", en: "Explore the home", sv: "Utforska bostaden" },
  furnished: { fi: "Kalustettu koti", en: "Furnished home", sv: "Möblerad bostad" },
  empty: { fi: "Tyhjä pohja", en: "Empty shell", sv: "Tom bostad" },
  furnishedAlt: { fi: "valoisa olohuone, demo-kuva", en: "bright living room, concept image", sv: "ljust vardagsrum, konceptbild" },
  emptyAlt: { fi: "tyhjä tila, demo-kuva", en: "empty room, concept image", sv: "tomt rum, konceptbild" },
  photoState: { fi: "Kuvan tila", en: "Image state", sv: "Bildläge" },
  propertyShowcase: { fi: "Kohteen digitaalinen esittely", en: "Digital property showcase", sv: "Digital objektvisning" },
  finnishHome: { fi: "Suomalainen koti", en: "Finnish home", sv: "Finländskt hem" },
  standardsTitle: { fi: "Rakennettu tämän arjen ympärille.", en: "Designed around everyday life.", sv: "Utformat kring vardagen." },
  standardsBody: { fi: "Kohdetiedot voidaan kuvata samalla rakenteella kuin suomalainen vuokratalo toimii: energiatehokkuus, märkätilat, kulku, tietoliikenne ja arjen säilytys näkyvät ennen hakemusta.", en: "The property story follows how a Finnish rental home works: energy, wet rooms, access, connectivity and everyday storage are visible before applying.", sv: "Objektinformationen följer hur ett finländskt hyreshem fungerar: energi, våtrum, tillgänglighet, uppkoppling och förvaring syns före ansökan." },
  tourTitle: { fi: "Kävele kodin läpi ennen kuin päätät.", en: "Walk through the home before you decide.", sv: "Gå genom hemmet innan du bestämmer dig." },
  tourBody: { fi: "Katso jokaiseen suuntaan asunnon omassa 3D-mallissa. Ovet, huoneet ja kalusteet vastaavat piirustusta. Vaihda huonetta, sisustusta tai kalustusta kierroksen aikana.", en: "Look in every direction inside this apartment’s own 3D model. Doors, rooms and furnishings follow its drawing. Change rooms, interior style or furnishing during the tour.", sv: "Se åt alla håll i bostadens egen 3D-modell. Dörrar, rum och möbler följer ritningen. Byt rum, inredningsstil eller möblering under rundturen." },
  workflow: { fi: "Julkaisun työnkulku", en: "Publishing workflow", sv: "Publiceringsflöde" },
  workflowTitle: { fi: "Yksi kuvaus. Monta kohtaamista.", en: "One capture. Many touchpoints.", sv: "En inspelning. Många möten." },
  capture: { fi: "Asunto kuvataan", en: "Capture the home", sv: "Bostaden fotograferas" },
  generate: { fi: "Kierros muodostuu", en: "Build the tour", sv: "Rundturen byggs" },
  publish: { fi: "Julkaise kerran", en: "Publish once", sv: "Publicera en gång" },
  captureBody: { fi: "Työntekijä kuvaa huoneet tuetulla 360°-kameralla tai puhelimella.", en: "A staff member captures the rooms with a supported 360° camera or phone.", sv: "Personal fotograferar rummen med en stödd 360°-kamera eller mobil." },
  generateBody: { fi: "Panoraamat, pohja ja tilat yhdistyvät valmiiksi esittelyksi.", en: "Panoramas, plan and spaces become one ready showcase.", sv: "Panorama, plan och rum blir en färdig visning." },
  publishBody: { fi: "Sama data palvelee hakua, kohdesivua, hakemusta ja asiakaspalvelua.", en: "The same data powers search, property pages, applications and service.", sv: "Samma data driver sökning, objektsidor, ansökningar och service." },
  nextStep: { fi: "Seuraava askel: liitä panoraama‑ID ja huoneiden metatiedot TampuuriAdapteriin.", en: "Next step: connect panorama IDs and room metadata to TampuuriAdapter.", sv: "Nästa steg: koppla panorama-ID och rumsmetadata till TampuuriAdapter." },
  viewConcept: { fi: "Katso konsepti", en: "View the concept", sv: "Se konceptet" },
};

const standardCopy: Record<string, LocalizedText> = {
  "Esteetön sisäänkäynti ja hissi": { fi: "Esteetön sisäänkäynti ja hissi", en: "Step-free entrance and lift", sv: "Stegfri entré och hiss" },
  "Kylpyhuoneessa pesutorni-varaus": { fi: "Kylpyhuoneessa pesutorni-varaus", en: "Washer-dryer provision in the bathroom", sv: "Förberedelse för tvättmaskin i badrummet" },
  "10 Mbit/s internet sisältyy vuokraan": { fi: "10 Mbit/s internet sisältyy vuokraan", en: "10 Mbps internet included", sv: "10 Mbit/s internet ingår" },
  "Juna-asema noin 4 minuutin päässä": { fi: "Juna-asema noin 4 minuutin päässä", en: "Train station about 4 minutes away", sv: "Tågstation cirka 4 minuter bort" },
  "Asuntokohtainen sauna": { fi: "Asuntokohtainen sauna", en: "Private sauna", sv: "Egen bastu" },
  "Lasitettu parveke syys- ja kevätkaudelle": { fi: "Lasitettu parveke syys- ja kevätkaudelle", en: "Glazed balcony for the shoulder seasons", sv: "Inglasad balkong för höst och vår" },
  "Muuntojoustava 3H + KT": { fi: "Muuntojoustava 3H + KT", en: "Flexible three-room layout", sv: "Flexibel planlösning med tre rum" },
  "Länteen avautuva lasitettu parveke": { fi: "Länteen avautuva lasitettu parveke", en: "West-facing glazed balcony", sv: "Inglasad balkong mot väster" },
  "Hissi ja esteetön kulku": { fi: "Hissi ja esteetön kulku", en: "Lift and step-free access", sv: "Hiss och stegfri tillgång" },
  "Matalan kynnyksen kulku ja oma sisäänkäynti": { fi: "Matalan kynnyksen kulku ja oma sisäänkäynti", en: "Low-threshold access and private entrance", sv: "Lågtröskelentré och egen ingång" },
  "Pihapaikka lähellä ovea": { fi: "Pihapaikka lähellä ovea", en: "Parking close to the door", sv: "Parkering nära dörren" },
  "Luonnonvalo ja näkymä Keravanjoelle": { fi: "Luonnonvalo ja näkymä Keravanjoelle", en: "Daylight and a view toward Keravanjoki", sv: "Dagsljus och utsikt mot Kervo å" },
  "Energiatehokas ulkovaippa": { fi: "Energiatehokas ulkovaippa", en: "Energy-efficient envelope", sv: "Energieffektivt klimatskal" },
  "Oma sauna ja pesutorni": { fi: "Oma sauna ja pesutorni", en: "Private sauna and washer-dryer", sv: "Egen bastu och tvättmaskin" },
  "Lämmin autopaikka / EV-varaus": { fi: "Lämmin autopaikka / EV-varaus", en: "Heated parking / EV provision", sv: "Uppvärmd parkering / elbilsförberedelse" },
  "Kompakti märkätila": { fi: "Kompakti märkätila", en: "Compact wet room", sv: "Kompakt våtrum" },
  "Selkeä esteetön kulkureitti": { fi: "Selkeä esteetön kulkureitti", en: "Clear step-free route", sv: "Tydlig stegfri rutt" },
  "Huoneistokohtainen ilmanvaihto": { fi: "Huoneistokohtainen ilmanvaihto", en: "Apartment-specific ventilation", sv: "Lägenhetsspecifik ventilation" },
  "Oma piha ja lämmin varasto": { fi: "Oma piha ja lämmin varasto", en: "Private yard and warm storage", sv: "Egen gård och varmt förråd" },
  "EV-latausvalmius pihapaikalla": { fi: "EV-latausvalmius pihapaikalla", en: "EV-ready outdoor parking", sv: "Elbilsklar gårdsplats" },
};

const materialCopy: Record<string, LocalizedText> = {
  "Vaalea tammi": { fi: "Vaalea tammi", en: "Light oak", sv: "Ljus ek" },
  "Himmeä savunsininen": { fi: "Himmeä savunsininen", en: "Muted smoke blue", sv: "Dämpad rökblå" },
  "Mattalakattu koivu": { fi: "Mattalakattu koivu", en: "Matt-lacquered birch", sv: "Mattlackad björk" },
  "Hunajakenno-tammi": { fi: "Hunajakenno-tammi", en: "Honey oak", sv: "Honungsek" },
  Terrakotta: { fi: "Terrakotta", en: "Terracotta", sv: "Terrakotta" },
  Koivuvaneri: { fi: "Koivuvaneri", en: "Birch plywood", sv: "Björkplywood" },
  "Vaalea saarni": { fi: "Vaalea saarni", en: "Light ash", sv: "Ljus ask" },
  Pellavabeige: { fi: "Pellavabeige", en: "Linen beige", sv: "Linnebeige" },
  "Himmeä sininen": { fi: "Himmeä sininen", en: "Soft blue", sv: "Dämpad blå" },
  "Pystypaneeli mänty": { fi: "Pystypaneeli mänty", en: "Vertical pine panel", sv: "Vertikal furupanel" },
  Sammalenvihreä: { fi: "Sammalenvihreä", en: "Moss green", sv: "Mossgrön" },
  "Luonnonvärinen pellava": { fi: "Luonnonvärinen pellava", en: "Natural linen", sv: "Naturfärgat linne" },
  Pähkinä: { fi: "Pähkinä", en: "Walnut", sv: "Valnöt" },
  "Syvä sinivihreä": { fi: "Syvä sinivihreä", en: "Deep blue-green", sv: "Djup blågrön" },
  "Harjattu teräs": { fi: "Harjattu teräs", en: "Brushed steel", sv: "Borstat stål" },
  "Vaalea koivu": { fi: "Vaalea koivu", en: "Light birch", sv: "Ljus björk" },
  Pilvensininen: { fi: "Pilvensininen", en: "Cloud blue", sv: "Molnblå" },
  "Mustat yksityiskohdat": { fi: "Mustat yksityiskohdat", en: "Black details", sv: "Svarta detaljer" },
  Luonnonmänty: { fi: "Luonnonmänty", en: "Natural pine", sv: "Naturfuru" },
  Harmaansininen: { fi: "Harmaansininen", en: "Grey blue", sv: "Gråblå" },
  "Kivitason mattapinta": { fi: "Kivitason mattapinta", en: "Matt stone surface", sv: "Matt stenyta" },
};

const apartmentFeatureCopy = {
  broadband: { fi: "Laajakaista", en: "Broadband", sv: "Bredband" },
  parking: { fi: "Autopaikka", en: "Parking", sv: "Bilplats" },
  pets: { fi: "Lemmikit", en: "Pets", sv: "Husdjur" },
  accessible: { fi: "Esteetön", en: "Accessible", sv: "Tillgänglig" },
  lift: { fi: "Hissi", en: "Lift", sv: "Hiss" },
  balcony: { fi: "Parveke", en: "Balcony", sv: "Balkong" },
};

export function KalliolinnaExperience() {
  const { text } = useLanguage();
  const searchParams = useSearchParams();
  const requestedApartment = searchParams.get("asunto") || "A12";
  const initialApartment = units.some((unit) => unit.id === requestedApartment) ? requestedApartment : "A12";
  const [floor, setFloor] = useState(apartments.find((item) => item.id === initialApartment)?.floor ?? 3);
  const [apt, setApt] = useState(initialApartment);
  const [fav, setFav] = useState(false);
  const selectedUnit = useMemo(() => units.find((unit) => unit.id === apt) ?? units[0], [apt]);
  const selectedApartment = useMemo(() => apartments.find((item) => item.id === apt) ?? apartments[0], [apt]);
  const floors = { kalliolinna:5, asemanvalo:4, ruukinranta:1, peltokaarre:3, keravanjoen:1 }[selectedApartment.variant];
  const propertyChoices = apartments.filter((item,index,list)=>list.findIndex(other=>other.variant===item.variant)===index);
  const floorUnits = units.filter(unit=>apartments.some(item=>item.id===unit.id&&item.variant===selectedApartment.variant&&item.floor===floor));
  function selectFloor(next:number) { setFloor(next); const home=apartments.find(item=>item.variant===selectedApartment.variant&&item.floor===next); if(home) {setApt(home.id);} }

  useEffect(() => {
    queueMicrotask(() => {
      const favourites = JSON.parse(localStorage.getItem("tuuma-favorites") || "[]") as string[];
      setFav(favourites.includes(apt));
    });
  }, [apt]);

  function favorite() {
    const favourites = JSON.parse(localStorage.getItem("tuuma-favorites") || "[]") as string[];
    const next = favourites.includes(apt) ? favourites.filter((id) => id !== apt) : [...favourites, apt];
    localStorage.setItem("tuuma-favorites", JSON.stringify(next));
    setFav(next.includes(apt));
    window.dispatchEvent(new Event("tuuma-favorites"));
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#f7f3e9] py-9 sm:py-14">
        <div className="pointer-events-none absolute -right-16 top-12 h-56 w-56 rounded-full border-[22px] border-[#e7d19c]/55 sm:h-80 sm:w-80" />
        <div className="shell relative">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow text-[#5f7180]">Digital Concept / {selectedApartment.area}</p>
              <h1 className="display mt-3 text-5xl text-[#102f4b] sm:text-7xl">{selectedApartment.title.split(" ")[0]}</h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-[#617381]">{selectedApartment.address}, Tuusula · {text(pageCopy.addressLead)}</p>
            </div>
            <span className="rounded-full border border-[#d2bd82] bg-[#fffdf8] px-4 py-2 text-xs font-black uppercase tracking-[.14em] text-[#7f6421]">Concept · Demo</span>
          </div>

          <nav className="mt-7 flex gap-2 overflow-x-auto pb-2" aria-label={text({fi:"Valitse talo",en:"Choose a building",sv:"Välj hus"})}>{propertyChoices.map(home=><button key={home.variant} aria-pressed={selectedApartment.variant===home.variant} onClick={()=>{setApt(home.id);setFloor(home.floor);}} className={`min-h-12 shrink-0 rounded-full border px-5 text-sm font-bold ${selectedApartment.variant===home.variant?"border-[#173655] bg-[#173655] text-white":"border-[#d7d7cc] bg-white text-[#173655]"}`}>{home.title.replace(` ${home.id}`,"")}</button>)}</nav>
          <div className="mt-5 grid overflow-hidden rounded-[30px] border border-[#e0d8c8] bg-[#fffdf8] shadow-[0_25px_80px_rgba(65,70,65,.12)] lg:grid-cols-[1.12fr_.88fr]">
            <div className="relative h-[min(58svh,420px)] min-h-[340px] bg-[#dfe9eb] sm:h-[600px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,.65),transparent_35%)]" />
              <BuildingScene variant={selectedApartment.variant} floor={floor} onFloorSelect={selectFloor} />
              <div className="absolute left-4 top-4 rounded-2xl border border-white/70 bg-[#fffdf8]/92 p-2 shadow-lg backdrop-blur sm:left-6 sm:top-6">
                <p className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[.16em] text-[#687b89]">{text(pageCopy.chooseFloor)}</p>
                <div className="grid grid-cols-5 gap-1 sm:block">
                  {Array.from({length:floors},(_,i)=>floors-i).map((item) => (
                    <button key={item} onClick={() => selectFloor(item)} className={`h-11 rounded-xl px-3 text-sm font-black transition sm:mb-1 sm:block sm:w-full sm:text-left ${floor === item ? "bg-[#0b58a8] text-white" : "text-[#4b647a] hover:bg-[#edf2f2]"}`}>
                      <span className="sm:hidden">{item}</span><span className="hidden sm:inline">{item}. kerros</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="rounded-2xl bg-[#102f4b]/88 px-4 py-3 text-white shadow-lg backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#c4dced]">{text(pageCopy.digitalShowcase)}</p>
                  <b className="mt-1 block">{text(pageCopy.showcaseBadges)}</b>
                </div>
                <a href="#asunto" className="grid h-12 w-12 place-items-center rounded-full bg-[#f0bd58] text-[#173655] shadow-lg" aria-label="Avaa asunnon tiedot"><Expand size={18} /></a>
              </div>
            </div>

            <div className="p-5 sm:p-9">
              <p className="eyebrow">{floor}. {text({ fi: "kerros", en: "floor", sv: "våning" })} · {text(pageCopy.selectHome)}</p>
              <h2 className="display mt-3 text-4xl text-[#102f4b] sm:text-5xl">{text(pageCopy.heroTitle)}</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#647786]">{text(pageCopy.heroIntro)}</p>
              <div className="mt-7 grid gap-3">
                {!floorUnits.length&&<p className="rounded-2xl border border-dashed p-5 text-sm text-slate-500">{text({fi:"Tässä kerroksessa ei ole demoasuntoa. Valitse toinen kerros tai talo.",en:"No demo apartment on this floor. Choose another floor or building.",sv:"Ingen demobostad på denna våning. Välj en annan våning eller byggnad."})}</p>}
                {floorUnits.map((unit) => (
                  <button key={unit.id} disabled={!unit.free} onClick={() => { setApt(unit.id); setFloor(apartments.find((item) => item.id === unit.id)?.floor ?? 3);  }} className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${apt === unit.id ? "border-[#0b58a8] bg-[#edf5fb] shadow-sm" : "border-[#dbe3e3] bg-white hover:border-[#94b4cc]"} ${!unit.free ? "cursor-not-allowed opacity-45" : ""}`}>
                    <span><b className="block text-lg text-[#173655]">{unit.id}</b><small className="text-[#687c8d]">{unit.r} · {unit.s}</small></span>
                    <span className="text-right"><b className="block text-[#173655]">{unit.rent} € / kk</b><small className={unit.free ? "text-[#08765f]" : "text-[#798a99]"}>{unit.availability}</small></span>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={apt} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-7 rounded-[22px] bg-[#102f4b] p-5 text-white">
                  <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#a8c7df]">{text(pageCopy.selectedHome)}</p><b className="mt-2 block text-2xl">{selectedUnit.id} · {selectedUnit.r}</b><span className="mt-1 block text-sm text-white/65">{selectedUnit.s} · {selectedUnit.availability}</span></div><span className="text-xl font-black">{selectedUnit.rent} €</span></div>
                  <a href="#asunto" className="mt-5 flex items-center justify-between rounded-xl bg-[#f0bd58] px-4 py-3 font-black text-[#173655]">{text(pageCopy.exploreHome)} <ChevronRight size={18} /></a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section id="asunto" className="shell py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.12fr_.88fr]">
          <ApartmentGallery key={selectedApartment.id} apartment={selectedApartment} />

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">{selectedApartment.title}</p>
            <h2 className="display mt-3 text-5xl text-[#102f4b]">{selectedUnit.r}</h2>
            <div className="mt-4 flex items-baseline justify-between gap-4"><span className="text-xl font-bold text-[#2d4c66]">{selectedUnit.s} · {selectedApartment.floor}. {text({ fi: "kerros", en: "floor", sv: "våning" })}</span><b className="text-2xl text-[#102f4b]">{selectedUnit.rent} €<small className="text-sm font-medium text-[#6d7d8e]"> / kk</small></b></div>
            <p className="mt-4 flex items-center gap-2 text-[#587087]"><MapPin size={17} /> {selectedApartment.address}, {selectedApartment.area}</p>
            <p className="mt-4 text-sm leading-6 text-[#5f7488]">{selectedApartment.description}</p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[[Wifi, "broadband"], [Car, "parking"], [PawPrint, "pets"], [Accessibility, "accessible"], [Building2, "lift"], [Box, "balcony"]].map(([Icon, key]) => { const I = Icon as typeof Wifi; const featureKey = key as keyof typeof apartmentFeatureCopy; const label = text(apartmentFeatureCopy[featureKey]); const value = featureKey === "parking" && !selectedApartment.parking ? text({ fi: "Ei autopaikkaa", en: "No parking", sv: "Ingen bilplats" }) : featureKey === "balcony" && !selectedApartment.balcony ? text({ fi: "Ei parveketta", en: "No balcony", sv: "Ingen balkong" }) : featureKey === "pets" && !selectedApartment.pets ? text({ fi: "Ei lemmikkejä", en: "No pets", sv: "Inga husdjur" }) : label; return <div key={featureKey} className="flex items-center gap-3 rounded-2xl border border-[#e0e6e5] bg-[#fffdf8] p-4 text-sm font-bold text-[#2f4b63]"><I size={19} className="text-[#0b58a8]" />{value}</div>; })}
            </div>
            <div className="mt-7 flex gap-2">
              <button onClick={favorite} className={`grid h-12 w-12 place-items-center rounded-full border ${fav ? "border-[#0b58a8] bg-[#0b58a8] text-white" : "border-[#d5dfe2] bg-[#fffdf8] text-[#173655]"}`} aria-label="Tallenna suosikkeihin"><Heart size={19} fill={fav ? "currentColor" : "none"} /></button>
              <button className="grid h-12 w-12 place-items-center rounded-full border border-[#d5dfe2] bg-[#fffdf8] text-[#173655]" aria-label="Jaa asunto"><Share2 size={18} /></button>
              <a href={`/hae?asunto=${selectedUnit.id}`} className="flex flex-1 items-center justify-center rounded-full bg-[#0b58a8] px-6 font-black text-white transition hover:bg-[#102f4b]">{text({ fi: "Hae asuntoa", en: "Apply", sv: "Ansök" })}</a>
            </div>
            <a href="/kustannukset" className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full border border-[#d5dfe2] bg-[#fffdf8] px-5 text-sm font-black text-[#274969]">{text({ fi: "Laske asumisen kokonaiskustannus", en: "Calculate total monthly cost", sv: "Beräkna total månadskostnad" })}</a>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#708196]"><Sparkles size={14} className="mt-0.5 shrink-0 text-[#c28d20]" /> {text({ fi: "Hakemus siirtyy turvallisesti nykyiseen Tampuuri-hakuprosessiin. Asuntotunnus esitäytetään automaattisesti.", en: "The application continues securely in the existing Tampuuri process with the home ID prefilled.", sv: "Ansökan fortsätter tryggt i den befintliga Tampuuri-processen med bostads-ID ifyllt." })}</p>
          </aside>
        </div>
      </section>
      <a href={`/hae?asunto=${selectedUnit.id}`} className="mobile-apply-cta fixed left-3 right-3 z-30 flex min-h-14 items-center justify-between rounded-full bg-[#0b58a8] px-5 font-black text-white shadow-[0_18px_40px_rgba(10,85,223,.32)] lg:hidden"><span>{text({ fi: "Hae asuntoa", en: "Apply", sv: "Ansök" })}</span><span>{selectedUnit.rent} € / kk</span></a>

      <section className="shell pb-16 sm:pb-20">
        <div className="grid gap-6">
          <ApartmentPlan key={`plan-${selectedUnit.id}`} initialApartment={selectedUnit.id} />
          <ApartmentDollhouse key={`dollhouse-${selectedApartment.id}`} apartment={selectedApartment} />
        </div>
      </section>

      <section className="bg-[#efe8d7] py-16 sm:py-20">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <div>
              <p className="eyebrow text-[#7d6525]">{text(pageCopy.finnishHome)} · region ready</p>
              <h2 className="display mt-3 text-4xl text-[#173655] sm:text-6xl">{text(pageCopy.standardsTitle)}</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#5e7180]">{text(pageCopy.standardsBody)}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {selectedApartment.standards.map((standard) => <div key={standard} className="rounded-[22px] border border-[#d6c8a5] bg-[#fffaf0] p-5"><span className="block h-2 w-12 rounded-full bg-[#c89b3c]" /><p className="mt-5 text-sm font-black leading-6 text-[#294862]">{text(standardCopy[standard] ?? { fi: standard, en: standard, sv: standard })}</p></div>)}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#d5c8a8] pt-6 text-sm font-bold text-[#627588]"><span>{text({ fi: "Materiaalipaletti", en: "Material palette", sv: "Materialpalett" })}</span>{selectedApartment.materials.map((material) => <span key={material} className="rounded-full border border-[#d4c294] bg-[#fffaf0] px-3 py-2 text-[#586c78]">{text(materialCopy[material] ?? { fi: material, en: material, sv: material })}</span>)}</div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {buildingPrinciples.map((principle) => <article key={principle.title.fi} className="rounded-[22px] border border-[#d6c8a5] bg-[#fffaf0] p-5"><span className="block h-2 w-10 rounded-full bg-[#0b58a8]" /><h3 className="mt-4 text-base font-black text-[#294862]">{text(principle.title)}</h3><p className="mt-2 text-sm leading-6 text-[#687888]">{text(principle.body)}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#102f4b] py-16 text-white sm:py-20">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow !text-[#a9c6db]">{text({ fi: "Virtuaaliesittely / 360°", en: "Virtual showcase / 360°", sv: "Virtuell visning / 360°" })}</p><h2 className="display mt-3 max-w-3xl text-4xl sm:text-6xl">{text(pageCopy.tourTitle)}</h2></div><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black">Live 3D · 360°</span></div>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">{text(pageCopy.tourBody)}</p>
          <div className="mt-9"><Tour360Viewer key={`tour-${selectedApartment.id}`} apartment={selectedApartment} /></div>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="eyebrow">{text(pageCopy.workflow)}</p><h2 className="display mt-3 text-4xl text-[#102f4b] sm:text-5xl">{text(pageCopy.workflowTitle)}</h2></div><ArrowRight className="hidden text-[#0b58a8] sm:block" /></div>
        <div className="grid gap-4 md:grid-cols-3">
          {[{ n: "01", stage: "Capture", title: pageCopy.capture, body: pageCopy.captureBody }, { n: "02", stage: "Generate", title: pageCopy.generate, body: pageCopy.generateBody }, { n: "03", stage: "Publish", title: pageCopy.publish, body: pageCopy.publishBody }].map((item, index) => <div key={item.n} className={`rounded-[24px] border p-6 sm:p-7 ${index === 2 ? "border-[#d8c487] bg-[#f5e8bf]" : "border-[#dce4e4] bg-[#fffdf8]"}`}><span className="eyebrow">{item.n} / {item.stage}</span><h3 className="mt-4 text-xl font-black text-[#173655]">{text(item.title)}</h3><p className="mt-3 leading-7 text-[#60748a]">{text(item.body)}</p></div>)}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-[#dce4e4] bg-[#edf3f2] px-5 py-4 text-sm text-[#476278]"><span>{text(pageCopy.nextStep)}</span><a href="/concept" className="flex items-center gap-2 font-black text-[#0b58a8]">{text(pageCopy.viewConcept)} <ArrowRight size={16} /></a></div>
      </section>
    </>
  );
}
