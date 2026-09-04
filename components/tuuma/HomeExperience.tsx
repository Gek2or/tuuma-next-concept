"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Car,
  ChevronLeft,
  CreditCard,
  KeyRound,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Wrench,
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
import { Progress } from "@/components/ui/progress";
import { apartments } from "@/lib/data";
const BuildingScene = dynamic(() => import("./BuildingScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm text-[#61758a]">
      3D-kohde latautuu…
    </div>
  ),
});
const quick = [
  { icon: Search, t: "Etsi asunto", href: "/kohteet" },
  { icon: Wrench, t: "Tee huoltopyyntö", href: "/asukkaille" },
  { icon: CreditCard, t: "Vuokra ja maksut", href: "/asukkaille" },
  { icon: Car, t: "Autopaikka", href: "/asukkaille" },
  { icon: KeyRound, t: "Muutto", href: "/asukkaille" },
  { icon: MessageCircle, t: "Ota yhteyttä", href: "/asukkaille" },
];
const questions = [
  {
    q: "Missä haluat asua?",
    key: "area",
    opts: ["Hyrylä", "Jokela", "Kellokoski", "Ei väliä"],
  },
  {
    q: "Kuinka monta henkilöä muuttaa?",
    key: "people",
    opts: ["1", "2", "3", "4+"],
  },
  {
    q: "Kuinka monta huonetta tarvitset?",
    key: "rooms",
    opts: ["1", "2", "3", "4+"],
  },
  {
    q: "Mikä on sopiva vuokrataso?",
    key: "budget",
    opts: ["alle 700 €", "700–850 €", "850–1 000 €", "yli 1 000 €"],
  },
  {
    q: "Tarvitsetko esteettömän asunnon?",
    key: "accessible",
    opts: ["Kyllä", "Ei"],
  },
  { q: "Onko sinulla auto?", key: "car", opts: ["Kyllä", "Ei"] },
  { q: "Tarvitsetko sähköauton latausta?", key: "ev", opts: ["Kyllä", "Ei"] },
  { q: "Onko sinulla lemmikkejä?", key: "pets", opts: ["Kyllä", "Ei"] },
  {
    q: "Onko joukkoliikenne tärkeä?",
    key: "transit",
    opts: ["Erittäin tärkeä", "Jonkin verran", "Ei"],
  },
];
function Matcher() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = step === questions.length;
  const results = useMemo(
    () =>
      apartments
        .map((a, i) => {
          let score = 96 - i * 3;
          if (
            answers.area &&
            answers.area !== "Ei väliä" &&
            answers.area !== a.area
          )
            score -= 12;
          if (answers.pets === "Kyllä" && !a.pets) score -= 20;
          if (answers.accessible === "Kyllä" && !a.accessible) score -= 15;
          if (answers.ev === "Kyllä" && !a.ev) score -= 10;
          return { ...a, score: Math.max(score, 68) };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    [answers],
  );
  function pick(v: string) {
    const q = questions[step];
    setAnswers((s) => ({ ...s, [q.key]: v }));
    setStep((s) => s + 1);
  }
  return (
    <div className="min-h-[390px]">
      {!done ? (
        <>
          <div className="mb-7 flex items-center justify-between">
            <span className="eyebrow">
              Vaihe {step + 1} / {questions.length}
            </span>
            <span className="text-sm font-semibold text-[#5f738a]">
              {Math.round((step / questions.length) * 100)} %
            </span>
          </div>
          <Progress value={(step / questions.length) * 100} />
          <h3 className="display mt-8 text-3xl leading-tight sm:text-4xl">
            {questions[step].q}
          </h3>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {questions[step].opts.map((o) => (
              <button
                key={o}
                onClick={() => pick(o)}
                className="min-h-14 rounded-2xl border border-[#d7e2ec] bg-white px-5 text-left font-bold transition hover:-translate-y-0.5 hover:border-[#7caef6] hover:bg-[#edf5ff]"
              >
                {o}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="mt-7 flex items-center gap-2 text-sm font-bold text-[#47627f]"
            >
              <ChevronLeft size={17} />
              Takaisin
            </button>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 text-[#0a55df]">
            <Sparkles />
            <span className="eyebrow !text-[#0a55df]">Älykäs suositus</span>
          </div>
          <h3 className="display mt-4 text-3xl">Sinulle sopivimmat kodit</h3>
          <div className="mt-6 grid gap-3">
            {results.map((a, i) => (
              <Link
                key={a.id}
                href="/kohteet/kalliolinna"
                className="flex items-center gap-4 rounded-2xl border border-[#dce6ef] bg-white p-3 transition hover:border-[#8eb5e3]"
              >
                <img
                  src={a.image}
                  alt=""
                  className="h-20 w-24 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <b className="truncate">{a.title}</b>
                    <span className="rounded-full bg-[#e7f7f2] px-2 py-1 text-xs font-black text-[#08765f]">
                      {a.score} % match
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#62758a]">
                    {a.rooms}h · {a.size} m² · {a.rent} €/kk
                  </p>
                  <p className="mt-1 truncate text-xs font-semibold text-[#315b88]">
                    {i === 0
                      ? "Budjettisi sisällä · hyvät yhteydet"
                      : a.tags.slice(0, 2).join(" · ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <button
            onClick={() => {
              setStep(0);
              setAnswers({});
            }}
            className="mt-5 text-sm font-bold text-[#0a55df]"
          >
            Aloita uudelleen
          </button>
        </>
      )}
    </div>
  );
}
const aiAnswers: Record<string, { text: string; cta: string }> = {
  "Kadotin avaimeni": {
    text: "Jos jäit oven ulkopuolelle, ota yhteys päivystävään ovenavauspalveluun. Henkilöllisyys tarkistetaan ennen avausta.",
    cta: "Soita päivystykseen",
  },
  "Pesukone vuotaa": {
    text: "Sulje pesukoneen vesihana heti, kuivaa näkyvä vesi ja tee kiireellinen huoltopyyntö. Jos vuoto jatkuu, soita päivystykseen.",
    cta: "Tee kiireellinen huoltopyyntö",
  },
  "Milloin vuokra pitää maksaa?": {
    text: "Vuokran eräpäivä näkyy vuokrasopimuksessasi ja maksutiedoissa. Maksa aina viitenumerolla, jotta suoritus kohdistuu oikein.",
    cta: "Avaa vuokra ja maksut",
  },
  "Miten teen huoltopyynnön?": {
    text: "Kuvaile vika, lisää halutessasi kuva ja kerro, saako huolto tulla yleisavaimella. Kiireellisissä vahingoissa soita päivystykseen.",
    cta: "Tee huoltopyyntö",
  },
  "Voinko pitää lemmikkiä?": {
    text: "Useimmissa kodeissa lemmikit ovat tervetulleita. Tarkista aina asuntokohtaiset ehdot ja pidä lemmikki kytkettynä yhteisillä alueilla.",
    cta: "Lue lemmikkiohje",
  },
  "Miten irtisanon asunnon?": {
    text: "Tee kirjallinen irtisanomisilmoitus. Palvelu näyttää irtisanomisajan ja ohjaa muuttotarkastuksen sekä avainten palautuksen.",
    cta: "Aloita irtisanominen",
  },
};
function Assistant() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>();
  const answer = selected ? aiAnswers[selected] : null;
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full bg-[#0a55df] px-5 py-4 font-bold text-white shadow-[0_18px_40px_rgba(10,85,223,.32)]"
        aria-label="Avaa Kysy Tuumalta"
      >
        <Sparkles size={18} />
        Kysy Tuumalta
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#071a2d]/45 p-0 sm:items-center sm:p-6"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setOpen(false);
          }}
        >
          <section
            className="max-h-[88vh] w-full overflow-auto rounded-t-[30px] bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-[30px] sm:p-7"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-title"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="eyebrow">Tietopohjainen apuri</span>
                <h2 id="ai-title" className="display mt-2 text-3xl">
                  Kysy Tuumalta
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#eef3f7]"
                aria-label="Sulje"
              >
                <X />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#60748a]">
              Vastaukset perustuvat Tuuman hyväksyttyihin ohjeisiin.
            </p>
            {answer ? (
              <div className="mt-6 rounded-3xl bg-[#edf5ff] p-6">
                <p className="leading-7">{answer.text}</p>
                <button className="mt-5 rounded-full bg-[#0a55df] px-5 py-3 text-sm font-bold text-white">
                  {answer.cta}
                </button>
                <button
                  onClick={() => setSelected(undefined)}
                  className="ml-3 text-sm font-bold text-[#365979]"
                >
                  Kysy muuta
                </button>
              </div>
            ) : (
              <div className="mt-6 grid gap-2">
                {Object.keys(aiAnswers).map((q) => (
                  <button
                    key={q}
                    onClick={() => setSelected(q)}
                    className="rounded-2xl border border-[#dde6ef] px-4 py-3 text-left text-sm font-semibold hover:bg-[#f3f7fb]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
export function HomeExperience() {
  return (
    <main id="main">
      <section className="relative overflow-hidden pb-10 pt-9 sm:pt-16">
        <div className="absolute inset-x-0 top-0 -z-10 h-[660px] bg-[radial-gradient(circle_at_82%_18%,#d5eaff_0,transparent_34%),linear-gradient(180deg,#f9fcff,#f5f8fb)]" />
        <div className="shell">
          <div className="mb-7 flex items-center gap-2">
            <span className="rounded-full bg-[#e3efff] px-3 py-2 text-[11px] font-black uppercase tracking-[.13em] text-[#0a55df]">
              Concept / Demo
            </span>
            <span className="text-xs font-semibold text-[#667d94]">
              Digital living layer 2026
            </span>
          </div>
          <div className="grid items-center gap-6 lg:grid-cols-[1.03fr_.97fr]">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <p className="eyebrow">Koti löytyy elämästä käsin</p>
              <h1 className="display mt-5 max-w-2xl text-[3.15rem] leading-[.98] text-[#0d2d4e] sm:text-[4.8rem] lg:text-[5.5rem]">
                Löydä koti, joka sopii sinun elämääsi.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#536a81]">
                Yksi selkeä palvelu kodin löytämiseen ja asumisen arkeen —
                älykkäästi, saavutettavasti ja ihmisläheisesti.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex min-h-14 items-center gap-3 rounded-full bg-[#0a55df] px-6 font-bold text-white shadow-[0_14px_30px_rgba(10,85,223,.25)]">
                      Löydä koti <ArrowRight size={18} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[92vh] overflow-auto rounded-[28px] p-6 sm:max-w-2xl sm:p-9">
                    <DialogHeader>
                      <DialogTitle className="sr-only">
                        Löydä minulle sopiva koti
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Vastaa kysymyksiin ja saat henkilökohtaiset
                        asuntosuositukset.
                      </DialogDescription>
                    </DialogHeader>
                    <Matcher />
                  </DialogContent>
                </Dialog>
                <Link
                  href="/asukkaille"
                  className="flex min-h-14 items-center rounded-full border border-[#ccd9e4] bg-white px-6 font-bold text-[#193b5e]"
                >
                  Olen jo asukas
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="glass relative h-[390px] overflow-hidden rounded-[34px] sm:h-[500px]"
            >
              <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between">
                <span className="rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-[#31516f]">
                  Kalliolinna · Hyrylä
                </span>
                <Link
                  href="/kohteet/kalliolinna"
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#102d4d] text-white"
                  aria-label="Avaa Kalliolinna"
                >
                  <ArrowRight size={17} />
                </Link>
              </div>
              <div className="h-full soft-grid">
                <BuildingScene />
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 backdrop-blur">
                <div className="flex items-end justify-between">
                  <div>
                    <b>Kalliolinna A12</b>
                    <p className="mt-1 text-sm text-[#60758a]">
                      2h + kt · 56,5 m² · vapaa 1.10.
                    </p>
                  </div>
                  <b className="text-lg">
                    790 €<small className="text-xs text-[#6d7d8e]"> / kk</small>
                  </b>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {quick.map(({ icon: Icon, t, href }) => (
              <Link
                key={t}
                href={href}
                className="group rounded-2xl border border-[#dde6ed] bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon size={20} className="text-[#0a55df]" />
                <span className="mt-4 block text-sm font-bold leading-5">
                  {t}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="shell py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[34px] bg-[#0d2e50] p-7 text-white sm:p-10">
            <p className="eyebrow !text-[#91bae5]">Etsitkö kotia?</p>
            <h2 className="display mt-5 text-4xl sm:text-5xl">
              Kerro arjestasi. Me etsimme sopivat kodit.
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-[#c7d8e9]">
              Smart Matcher huomioi perheen, liikkumisen, budjetin ja arjen
              tarpeet — eikä vain neliöitä.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <button className="mt-8 flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-[#123354]">
                  Löydä minulle koti <Sparkles size={17} />
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[92vh] overflow-auto rounded-[28px] p-6 sm:max-w-2xl sm:p-9">
                <DialogHeader>
                  <DialogTitle className="sr-only">
                    Smart Home Matcher
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Asuntosuositus tarpeidesi perusteella.
                  </DialogDescription>
                </DialogHeader>
                <Matcher />
              </DialogContent>
            </Dialog>
          </div>
          <div className="rounded-[34px] bg-[#dfedff] p-7 sm:p-10">
            <p className="eyebrow">Oletko jo asukas?</p>
            <h2 className="display mt-5 text-4xl sm:text-5xl">
              Asumisen asiat ilman etsimistä.
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-[#506b87]">
              Ohjattu huoltoapu, vuokratiedot, avaimet ja muutto yhdessä
              helposti hahmotettavassa palvelussa.
            </p>
            <Link
              href="/asukkaille"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0a55df] px-5 py-3 font-bold text-white"
            >
              Miten voimme auttaa? <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="shell pb-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Vapaat kodit</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">
              Ajankohtaista juuri nyt
            </h2>
          </div>
          <Link
            href="/kohteet"
            className="hidden text-sm font-bold text-[#0a55df] sm:block"
          >
            Näytä kaikki →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {apartments.slice(0, 3).map((a) => (
            <Link
              key={a.id}
              href="/kohteet/kalliolinna"
              className="group overflow-hidden rounded-[28px] bg-white shadow-[0_15px_50px_rgba(20,52,84,.08)]"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={a.image}
                  alt={`${a.title}, valoisa asunto`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs font-bold">
                  {a.available}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black">{a.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-[#6a7e91]">
                      <MapPin size={14} />
                      {a.area}
                    </p>
                  </div>
                  <b>
                    {a.rent} €
                    <small className="font-normal text-[#6b7c8e]">/kk</small>
                  </b>
                </div>
                <p className="mt-5 text-sm font-bold text-[#395775]">
                  {a.rooms}h · {a.size} m² · {a.floor}. kerros
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Assistant />
    </main>
  );
}
