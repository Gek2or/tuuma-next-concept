"use client";

import dynamic from "next/dynamic";
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
import { useLanguage } from "./LanguageProvider";
import { ApartmentPlan } from "./ApartmentPlan";

const BuildingScene = dynamic(() => import("./BuildingScene"), { ssr: false });
const ApartmentDollhouse = dynamic(() => import("./ApartmentDollhouse"), { ssr: false });
const Tour360Viewer = dynamic(() => import("./Tour360Viewer"), {
  ssr: false,
  loading: () => <div className="grid min-h-[520px] place-items-center rounded-[30px] bg-[#0a223d] text-sm font-bold text-white/70">360°‑kierros latautuu…</div>,
});

const units = [
  { id: "A12", r: "2H+KT", s: "56,5 m²", rent: 790, free: true, availability: "Vapaa 1.10." },
  { id: "A14", r: "3H+KT", s: "68 m²", rent: 865, free: true, availability: "Vapaa 15.10." },
  { id: "A16", r: "2H+KT", s: "51 m²", rent: 760, free: false, availability: "Varattu" },
];

export function KalliolinnaExperience() {
  const { text } = useLanguage();
  const [floor, setFloor] = useState(3);
  const [apt, setApt] = useState("A12");
  const [fav, setFav] = useState(false);
  const selectedUnit = useMemo(() => units.find((unit) => unit.id === apt) ?? units[0], [apt]);
  const selectedApartment = useMemo(() => apartments.find((item) => item.id === apt) ?? apartments[0], [apt]);

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
              <p className="eyebrow text-[#5f7180]">Digital Concept / Hyrylä</p>
              <h1 className="display mt-3 text-5xl text-[#102f4b] sm:text-7xl">Kalliolinna</h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-[#617381]">Kalliorinteentie 8, Tuusula · uusi tapa kokea koti ennen hakemusta.</p>
            </div>
            <span className="rounded-full border border-[#d2bd82] bg-[#fffdf8] px-4 py-2 text-xs font-black uppercase tracking-[.14em] text-[#7f6421]">Concept · Demo</span>
          </div>

          <div className="mt-9 grid overflow-hidden rounded-[30px] border border-[#e0d8c8] bg-[#fffdf8] shadow-[0_25px_80px_rgba(65,70,65,.12)] lg:grid-cols-[1.12fr_.88fr]">
            <div className="relative h-[450px] bg-[#dfe9eb] sm:h-[600px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,.65),transparent_35%)]" />
              <BuildingScene />
              <div className="absolute left-4 top-4 rounded-2xl border border-white/70 bg-[#fffdf8]/92 p-2 shadow-lg backdrop-blur sm:left-6 sm:top-6">
                <p className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[.16em] text-[#687b89]">Valitse kerros</p>
                <div className="grid grid-cols-5 gap-1 sm:block">
                  {[5, 4, 3, 2, 1].map((item) => (
                    <button key={item} onClick={() => setFloor(item)} className={`h-10 rounded-xl px-3 text-xs font-black transition sm:mb-1 sm:block sm:w-full sm:text-left ${floor === item ? "bg-[#0b58a8] text-white" : "text-[#4b647a] hover:bg-[#edf2f2]"}`}>
                      <span className="sm:hidden">{item}</span><span className="hidden sm:inline">{item}. kerros</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="rounded-2xl bg-[#102f4b]/88 px-4 py-3 text-white shadow-lg backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#c4dced]">Kohteen digitaalinen esittely</p>
                  <b className="mt-1 block">Pohja · 3D · 360°</b>
                </div>
                <a href="#asunto" className="grid h-12 w-12 place-items-center rounded-full bg-[#f0bd58] text-[#173655] shadow-lg" aria-label="Avaa asunnon tiedot"><Expand size={18} /></a>
              </div>
            </div>

            <div className="p-5 sm:p-9">
              <p className="eyebrow">{floor}. kerros · valitse koti</p>
              <h2 className="display mt-3 text-4xl text-[#102f4b] sm:text-5xl">Koti, jonka voit tuntea jo nyt.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#647786]">Avaa asunto, tutki pohjaa, pyöritä 3D‑mallia ja astu sisään virtuaalikierroksella.</p>
              <div className="mt-7 grid gap-3">
                {units.map((unit) => (
                  <button key={unit.id} disabled={!unit.free} onClick={() => setApt(unit.id)} className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${apt === unit.id ? "border-[#0b58a8] bg-[#edf5fb] shadow-sm" : "border-[#dbe3e3] bg-white hover:border-[#94b4cc]"} ${!unit.free ? "cursor-not-allowed opacity-45" : ""}`}>
                    <span><b className="block text-lg text-[#173655]">{unit.id}</b><small className="text-[#687c8d]">{unit.r} · {unit.s}</small></span>
                    <span className="text-right"><b className="block text-[#173655]">{unit.rent} € / kk</b><small className={unit.free ? "text-[#08765f]" : "text-[#798a99]"}>{unit.availability}</small></span>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={apt} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-7 rounded-[22px] bg-[#102f4b] p-5 text-white">
                  <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#a8c7df]">Valittu koti</p><b className="mt-2 block text-2xl">{selectedUnit.id} · {selectedUnit.r}</b><span className="mt-1 block text-sm text-white/65">{selectedUnit.s} · {selectedUnit.availability}</span></div><span className="text-xl font-black">{selectedUnit.rent} €</span></div>
                  <a href="#asunto" className="mt-5 flex items-center justify-between rounded-xl bg-[#f0bd58] px-4 py-3 font-black text-[#173655]">Tutustu asuntoon <ChevronRight size={18} /></a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section id="asunto" className="shell py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.12fr_.88fr]">
          <div>
            <div className="relative overflow-hidden rounded-[28px] border border-[#dbe2e2] bg-[#e4ebec]">
              <img src={selectedApartment.image} alt={`${selectedUnit.id} valoisa olohuone, demo-kuva`} className="h-[390px] w-full object-cover sm:h-[570px]" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 sm:inset-x-6 sm:bottom-6"><span className="rounded-full bg-[#fffdf8]/92 px-4 py-2 text-sm font-black text-[#173655] shadow">{selectedUnit.id} · Olohuone · demo-kuva</span><span className="rounded-full bg-[#173655]/85 px-4 py-2 text-xs font-bold text-white">Kuva + 360°</span></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
              {apartments.slice(1, 4).map((item, index) => <img key={item.id} src={item.image} alt={`Asunnon ${item.id} demo-kuva ${index + 2}`} className="h-24 w-full rounded-2xl border border-[#dbe2e2] object-cover sm:h-40" />)}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Kalliolinna {selectedUnit.id}</p>
            <h2 className="display mt-3 text-5xl text-[#102f4b]">{selectedUnit.r}</h2>
            <div className="mt-4 flex items-baseline justify-between gap-4"><span className="text-xl font-bold text-[#2d4c66]">{selectedUnit.s} · {floor}. kerros</span><b className="text-2xl text-[#102f4b]">{selectedUnit.rent} €<small className="text-sm font-medium text-[#6d7d8e]"> / kk</small></b></div>
            <p className="mt-4 flex items-center gap-2 text-[#587087]"><MapPin size={17} /> Kalliorinteentie 8, Hyrylä</p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[[Wifi, "Laajakaista"], [Car, "Autopaikka"], [PawPrint, "Lemmikit"], [Accessibility, "Esteetön"], [Building2, "Hissi"], [Box, "Parveke"]].map(([Icon, label]) => { const I = Icon as typeof Wifi; return <div key={String(label)} className="flex items-center gap-3 rounded-2xl border border-[#e0e6e5] bg-[#fffdf8] p-4 text-sm font-bold text-[#2f4b63]"><I size={19} className="text-[#0b58a8]" />{String(label)}</div>; })}
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

      <section className="shell pb-16 sm:pb-20">
        <div className="grid gap-6">
          <ApartmentPlan key={selectedUnit.id} initialApartment={selectedUnit.id === "A14" ? "A14" : "A12"} />
          <ApartmentDollhouse />
        </div>
      </section>

      <section className="bg-[#102f4b] py-16 text-white sm:py-20">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow !text-[#a9c6db]">Virtuaaliesittely / 360°</p><h2 className="display mt-3 max-w-3xl text-4xl sm:text-6xl">Kävele kodin läpi ennen kuin päätät.</h2></div><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black">equirectangular demo</span></div>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">Huoneet, hotspotit ja pohjakartta toimivat samassa kierrossa. Tuotannossa työntekijä voi julkaista puhelimella kuvatun panoraaman ilman uutta sivutyötä.</p>
          <div className="mt-9"><Tour360Viewer /></div>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="eyebrow">Julkaisun työnkulku</p><h2 className="display mt-3 text-4xl text-[#102f4b] sm:text-5xl">Yksi kuvaus. Monta kohtaamista.</h2></div><ArrowRight className="hidden text-[#0b58a8] sm:block" /></div>
        <div className="grid gap-4 md:grid-cols-3">
          {[{ n: "01", title: "Asunto kuvataan", body: "Työntekijä kuvaa huoneet tuetulla 360°-kameralla tai puhelimella." }, { n: "02", title: "Kierros muodostuu", body: "Panoraamat, pohja ja tilat yhdistyvät valmiiksi esittelyksi." }, { n: "03", title: "Julkaise kerran", body: "Sama data palvelee hakua, kohdesivua, hakemusta ja asiakaspalvelua." }].map((item, index) => <div key={item.n} className={`rounded-[24px] border p-6 sm:p-7 ${index === 2 ? "border-[#d8c487] bg-[#f5e8bf]" : "border-[#dce4e4] bg-[#fffdf8]"}`}><span className="eyebrow">{item.n} / {index === 0 ? "Capture" : index === 1 ? "Generate" : "Publish"}</span><h3 className="mt-4 text-xl font-black text-[#173655]">{item.title}</h3><p className="mt-3 leading-7 text-[#60748a]">{item.body}</p></div>)}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-[#dce4e4] bg-[#edf3f2] px-5 py-4 text-sm text-[#476278]"><span>Seuraava askel: liitä panoraama‑ID ja huoneiden metatiedot TampuuriAdapteriin.</span><a href="/concept" className="flex items-center gap-2 font-black text-[#0b58a8]">Katso konsepti <ArrowRight size={16} /></a></div>
      </section>
    </>
  );
}
