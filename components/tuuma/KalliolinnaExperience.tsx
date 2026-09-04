"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Box,
  Building2,
  Car,
  Check,
  ChevronRight,
  Expand,
  Heart,
  MapPin,
  PawPrint,
  Share2,
  Sparkles,
  Wifi,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apartments } from "@/lib/data";
const BuildingScene = dynamic(() => import("./BuildingScene"), { ssr: false });
const rooms = [
  { name: "Olohuone", pos: "50% 48%" },
  { name: "Keittiö", pos: "24% 48%" },
  { name: "Makuuhuone", pos: "80% 48%" },
  { name: "Kylpyhuone", pos: "35% 70%" },
  { name: "Parveke", pos: "90% 36%" },
];
function Tour() {
  const [room, setRoom] = useState(0);
  const [full, setFull] = useState(false);
  const View = () => (
    <div
      className={`${full ? "fixed inset-0 z-[90] rounded-none" : "relative h-[480px] rounded-[30px]"} overflow-hidden bg-[#0b233e]`}
    >
      <motion.div
        key={room}
        initial={{ opacity: 0.5, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg,rgba(4,22,42,.05),rgba(4,22,42,.34)),url(${apartments[(room + 1) % apartments.length].image})`,
          backgroundPosition: rooms[room].pos,
        }}
      />
      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-black">
          360° · {rooms[room].name}
        </span>
        <button
          onClick={() => setFull((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/90"
          aria-label={full ? "Poistu koko näytöstä" : "Koko näyttö"}
        >
          {full ? <X /> : <Expand />}
        </button>
      </div>
      <button
        onClick={() => setRoom((room + 1) % rooms.length)}
        className="absolute left-[58%] top-[48%] grid h-14 w-14 place-items-center rounded-full border-4 border-white/70 bg-[#0a55df] text-white shadow-xl"
        aria-label="Siirry seuraavaan huoneeseen"
      >
        <ArrowRight />
      </button>
      <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto rounded-2xl bg-[#0a233e]/70 p-2 backdrop-blur">
        {rooms.map((r, i) => (
          <button
            key={r.name}
            onClick={() => setRoom(i)}
            className={`shrink-0 rounded-xl px-4 py-3 text-sm font-bold ${i === room ? "bg-white text-[#102e4e]" : "text-white hover:bg-white/10"}`}
          >
            {r.name}
          </button>
        ))}
      </div>
      <div className="absolute bottom-24 right-4 hidden h-28 w-40 rounded-2xl bg-white/90 p-3 sm:block">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#597089]">
          Pohjakartta
        </span>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {rooms.map((_, i) => (
            <button
              key={i}
              onClick={() => setRoom(i)}
              className={`h-7 rounded ${i === room ? "bg-[#0a55df]" : "bg-[#cfe0ed]"}`}
              aria-label={`Huone ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
  return (
    <>
      <View />
      <p className="mt-3 flex items-center gap-2 text-sm text-[#61758a]">
        <Sparkles size={16} />
        Gyroskooppiohjaus voidaan aktivoida mobiililaitteilla
        integraatiovaiheessa.
      </p>
    </>
  );
}
export function KalliolinnaExperience() {
  const [floor, setFloor] = useState(3);
  const [apt, setApt] = useState("A12");
  const [fav, setFav] = useState(false);
  useEffect(
    () =>
      setFav(
        (
          JSON.parse(
            localStorage.getItem("tuuma-favorites") || "[]",
          ) as string[]
        ).includes("A12"),
      ),
    [],
  );
  function favorite() {
    const old = JSON.parse(
      localStorage.getItem("tuuma-favorites") || "[]",
    ) as string[];
    const next = old.includes("A12")
      ? old.filter((x) => x !== "A12")
      : [...old, "A12"];
    localStorage.setItem("tuuma-favorites", JSON.stringify(next));
    setFav(next.includes("A12"));
    window.dispatchEvent(new Event("tuuma-favorites"));
  }
  return (
    <>
      <section className="bg-[#e8f2fb] py-8 sm:py-14">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Kohde / Hyrylä</p>
              <h1 className="display mt-3 text-5xl sm:text-6xl">Kalliolinna</h1>
              <p className="mt-3 text-[#5d7389]">
                Digital Concept · Kalliorinteentie 8, Tuusula
              </p>
            </div>
            <span className="rounded-full bg-white px-4 py-3 text-sm font-black text-[#0a55df]">
              12 vapaata kotia
            </span>
          </div>
          <div className="mt-8 grid overflow-hidden rounded-[34px] bg-white shadow-[0_25px_70px_rgba(17,50,83,.12)] lg:grid-cols-[1.15fr_.85fr]">
            <div className="relative h-[470px] soft-grid sm:h-[620px]">
              <BuildingScene />
              <div className="absolute left-4 top-4 rounded-2xl bg-white/90 p-2 backdrop-blur">
                <p className="px-3 pb-2 pt-1 text-xs font-black uppercase tracking-wider text-[#5f758b]">
                  Valitse kerros
                </p>
                {[5, 4, 3, 2, 1].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFloor(f)}
                    className={`mb-1 block h-11 w-full rounded-xl px-4 text-left text-sm font-black ${floor === f ? "bg-[#0a55df] text-white" : "hover:bg-[#edf4f9]"}`}
                  >
                    {f}. kerros
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 sm:p-9">
              <p className="eyebrow">{floor}. kerros</p>
              <h2 className="display mt-3 text-4xl">Valitse asunto</h2>
              <div className="mt-7 grid gap-3">
                {[
                  {
                    id: "A12",
                    r: "2H+KT",
                    s: "56,5 m²",
                    p: "790 € / kk",
                    free: true,
                  },
                  {
                    id: "A14",
                    r: "3H+KT",
                    s: "68 m²",
                    p: "865 € / kk",
                    free: true,
                  },
                  { id: "A16", r: "2H+KT", s: "51 m²", p: "—", free: false },
                ].map((a) => (
                  <button
                    key={a.id}
                    disabled={!a.free}
                    onClick={() => setApt(a.id)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${apt === a.id ? "border-[#0a55df] bg-[#eaf3ff]" : "border-[#dce5ed]"} ${!a.free ? "opacity-45" : "hover:border-[#8fb3d8]"}`}
                  >
                    <span>
                      <b className="block text-lg">{a.id}</b>
                      <small className="text-[#64788d]">
                        {a.r} · {a.s}
                      </small>
                    </span>
                    <span className="text-right">
                      <b className="block">{a.p}</b>
                      <small
                        className={a.free ? "text-[#08765f]" : "text-[#798a99]"}
                      >
                        {a.free ? "Vapaa" : "Varattu"}
                      </small>
                    </span>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={apt}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 rounded-2xl bg-[#102e4e] p-5 text-white"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#94b7d8]">
                        Valittu koti
                      </p>
                      <b className="mt-2 block text-2xl">{apt} · 2H+KT</b>
                    </div>
                    <span className="text-xl font-black">790 €</span>
                  </div>
                  <a
                    href="#asunto"
                    className="mt-5 flex items-center justify-between rounded-xl bg-white px-4 py-3 font-black text-[#102e4e]"
                  >
                    Tutustu asuntoon <ChevronRight />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      <section id="asunto" className="shell py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="relative overflow-hidden rounded-[32px]">
              <img
                src={apartments[0].image}
                alt="Kalliolinna A12 valoisa olohuone"
                className="h-[420px] w-full object-cover sm:h-[600px]"
              />
              <span className="absolute bottom-5 left-5 rounded-full bg-white px-4 py-2 text-sm font-bold">
                Olohuone · demo-kuva
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {apartments.slice(1, 4).map((a, i) => (
                <img
                  key={a.id}
                  src={a.image}
                  alt={`Asunnon demo-kuva ${i + 2}`}
                  className="h-28 w-full rounded-2xl object-cover sm:h-44"
                />
              ))}
            </div>
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Kalliolinna A12</p>
            <h2 className="display mt-3 text-5xl">2H + KT</h2>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-xl font-bold">56,5 m² · 3. kerros</span>
              <b className="text-2xl">
                790 €<small className="text-sm font-medium"> / kk</small>
              </b>
            </div>
            <p className="mt-5 flex items-center gap-2 text-[#587087]">
              <MapPin size={17} />
              Kalliorinteentie 8, Hyrylä
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[
                [Wifi, "Laajakaista"],
                [Car, "Autopaikka"],
                [PawPrint, "Lemmikit"],
                [Accessibility, "Esteetön"],
                [Building2, "Hissi"],
                [Box, "Parveke"],
              ].map(([I, l]) => {
                const Icon = I as typeof Wifi;
                return (
                  <div
                    key={String(l)}
                    className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-bold"
                  >
                    <Icon size={19} className="text-[#0a55df]" />
                    {String(l)}
                  </div>
                );
              })}
            </div>
            <div className="mt-7 flex gap-2">
              <button
                onClick={favorite}
                className={`grid h-12 w-12 place-items-center rounded-full border ${fav ? "bg-[#0a55df] text-white" : "bg-white"}`}
                aria-label="Tallenna suosikkeihin"
              >
                <Heart fill={fav ? "currentColor" : "none"} />
              </button>
              <button
                className="grid h-12 w-12 place-items-center rounded-full border bg-white"
                aria-label="Jaa"
              >
                <Share2 />
              </button>
              <a href="/hae?asunto=A12" className="flex flex-1 items-center justify-center rounded-full bg-[#0a55df] px-6 font-black text-white">
                Hae asuntoa
              </a>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#708196]">
              Hakemus siirtyy turvallisesti nykyiseen Tampuuri-hakuprosessiin.
              Asuntotunnus A12 esitäytetään automaattisesti.
            </p>
          </aside>
        </div>
      </section>
      <section className="bg-[#0d2e50] py-20 text-white">
        <div className="shell">
          <p className="eyebrow !text-[#91b9df]">Virtuaaliesittely</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <h2 className="display text-4xl sm:text-5xl">
              Tutustu kotiin huone kerrallaan
            </h2>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
              360° demo
            </span>
          </div>
          <div className="mt-9">
            <Tour />
          </div>
        </div>
      </section>
      <section className="shell py-20">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[28px] bg-white p-7">
            <span className="eyebrow">01 / Capture</span>
            <h3 className="mt-4 text-xl font-black">Asunto kuvataan</h3>
            <p className="mt-3 leading-7 text-[#60748a]">
              Työntekijä kuvaa huoneet 360°-kameralla tai tuetulla puhelimella.
            </p>
          </div>
          <div className="rounded-[28px] bg-white p-7">
            <span className="eyebrow">02 / Generate</span>
            <h3 className="mt-4 text-xl font-black">Kierros muodostuu</h3>
            <p className="mt-3 leading-7 text-[#60748a]">
              Kuvat, huoneet ja pohjakartta yhdistetään valmiiksi esittelyksi.
            </p>
          </div>
          <div className="rounded-[28px] bg-[#dfeeff] p-7">
            <span className="eyebrow">03 / Publish</span>
            <h3 className="mt-4 text-xl font-black">Julkaisu yhdellä kertaa</h3>
            <p className="mt-3 leading-7 text-[#60748a]">
              Virtuaalikierros tulee osaksi kohdesivua ilman erillistä
              sivutyötä.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
