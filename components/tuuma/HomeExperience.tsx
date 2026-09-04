"use client";
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
import { useLanguage } from "./LanguageProvider";
const quick = [
  { icon: Search, label: { fi: "Etsi asunto", en: "Find a home", sv: "Sök bostad" }, href: "/kohteet" },
  { icon: Wrench, label: { fi: "Tee huoltopyyntö", en: "Maintenance request", sv: "Serviceanmälan" }, href: "/huolto" },
  { icon: CreditCard, label: { fi: "Vuokra ja maksut", en: "Rent and payments", sv: "Hyra och betalningar" }, href: "/oma-koti#payments" },
  { icon: Car, label: { fi: "Autopaikka", en: "Parking", sv: "Bilplats" }, href: "/oma-koti#bookings" },
  { icon: KeyRound, label: { fi: "Muutto", en: "Moving", sv: "Flytt" }, href: "/muutto" },
  { icon: MessageCircle, label: { fi: "Ota yhteyttä", en: "Contact us", sv: "Kontakta oss" }, href: "/asukkaille" },
];
const questions = [
  {
    q: { fi: "Missä haluat asua?", en: "Where would you like to live?", sv: "Var vill du bo?" },
    key: "area",
    opts: [
      { value: "hyryla", label: { fi: "Hyrylä", en: "Hyrylä", sv: "Hyrylä" } },
      { value: "jokela", label: { fi: "Jokela", en: "Jokela", sv: "Jokela" } },
      { value: "kellokoski", label: { fi: "Kellokoski", en: "Kellokoski", sv: "Kellokoski" } },
      { value: "any", label: { fi: "Ei väliä", en: "No preference", sv: "Spelar ingen roll" } },
    ],
  },
  {
    q: { fi: "Kuinka monta henkilöä muuttaa?", en: "How many people are moving?", sv: "Hur många personer flyttar?" },
    key: "people",
    opts: ["1", "2", "3", "4+"].map((value) => ({ value, label: { fi: value, en: value, sv: value } })),
  },
  {
    q: { fi: "Kuinka monta huonetta tarvitset?", en: "How many rooms do you need?", sv: "Hur många rum behöver du?" },
    key: "rooms",
    opts: ["1", "2", "3", "4+"].map((value) => ({ value, label: { fi: value, en: value, sv: value } })),
  },
  {
    q: { fi: "Mikä on sopiva vuokrataso?", en: "What monthly rent suits you?", sv: "Vilken hyresnivå passar dig?" },
    key: "budget",
    opts: [
      { value: "700", label: { fi: "alle 700 €", en: "under €700", sv: "under 700 €" } },
      { value: "850", label: { fi: "700–850 €", en: "€700–850", sv: "700–850 €" } },
      { value: "1000", label: { fi: "850–1 000 €", en: "€850–1,000", sv: "850–1 000 €" } },
      { value: "1200", label: { fi: "yli 1 000 €", en: "over €1,000", sv: "över 1 000 €" } },
    ],
  },
  {
    q: { fi: "Tarvitsetko esteettömän asunnon?", en: "Do you need an accessible home?", sv: "Behöver du en tillgänglig bostad?" },
    key: "accessible",
    opts: [
      { value: "yes", label: { fi: "Kyllä", en: "Yes", sv: "Ja" } },
      { value: "no", label: { fi: "Ei", en: "No", sv: "Nej" } },
    ],
  },
  { q: { fi: "Onko sinulla auto?", en: "Do you have a car?", sv: "Har du bil?" }, key: "car", opts: [{ value: "yes", label: { fi: "Kyllä", en: "Yes", sv: "Ja" } }, { value: "no", label: { fi: "Ei", en: "No", sv: "Nej" } }] },
  { q: { fi: "Tarvitsetko sähköauton latausta?", en: "Do you need EV charging?", sv: "Behöver du laddning för elbil?" }, key: "ev", opts: [{ value: "yes", label: { fi: "Kyllä", en: "Yes", sv: "Ja" } }, { value: "no", label: { fi: "Ei", en: "No", sv: "Nej" } }] },
  { q: { fi: "Onko sinulla lemmikkejä?", en: "Do you have pets?", sv: "Har du husdjur?" }, key: "pets", opts: [{ value: "yes", label: { fi: "Kyllä", en: "Yes", sv: "Ja" } }, { value: "no", label: { fi: "Ei", en: "No", sv: "Nej" } }] },
  {
    q: { fi: "Onko joukkoliikenne tärkeä?", en: "Is public transport important?", sv: "Är kollektivtrafik viktig?" },
    key: "transit",
    opts: [
      { value: "high", label: { fi: "Erittäin tärkeä", en: "Very important", sv: "Mycket viktig" } },
      { value: "some", label: { fi: "Jonkin verran", en: "Somewhat", sv: "Till en del" } },
      { value: "no", label: { fi: "Ei", en: "No", sv: "Nej" } },
    ],
  },
];
function Matcher() {
  const { locale, text } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = step === questions.length;
  const results = useMemo(
    () =>
      apartments
        .map((a, i) => {
          let score = 96 - i * 3;
          const area = { hyryla: "Hyrylä", jokela: "Jokela", kellokoski: "Kellokoski" }[answers.area];
          if (area && area !== a.area)
            score -= 12;
          if (answers.pets === "yes" && !a.pets) score -= 20;
          if (answers.accessible === "yes" && !a.accessible) score -= 15;
          if (answers.ev === "yes" && !a.ev) score -= 10;
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
              {text({ fi: "Vaihe", en: "Step", sv: "Steg" })} {step + 1} / {questions.length}
            </span>
            <span className="text-sm font-semibold text-[#5f738a]">
              {Math.round((step / questions.length) * 100)} %
            </span>
          </div>
          <Progress value={(step / questions.length) * 100} />
          <h3 className="display mt-8 text-3xl leading-tight sm:text-4xl">
            {questions[step].q[locale]}
          </h3>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {questions[step].opts.map((o) => (
              <button
                key={o.value}
                onClick={() => pick(o.value)}
                className="min-h-14 rounded-2xl border border-[#d7e2ec] bg-white px-5 text-left font-bold transition hover:-translate-y-0.5 hover:border-[#7caef6] hover:bg-[#edf5ff]"
              >
                {o.label[locale]}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="mt-7 flex items-center gap-2 text-sm font-bold text-[#47627f]"
            >
              <ChevronLeft size={17} />
              {text({ fi: "Takaisin", en: "Back", sv: "Tillbaka" })}
            </button>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 text-[#0a55df]">
            <Sparkles />
            <span className="eyebrow !text-[#0a55df]">{text({ fi: "Älykäs suositus", en: "Smart recommendation", sv: "Smart rekommendation" })}</span>
          </div>
          <h3 className="display mt-4 text-3xl">{text({ fi: "Sinulle sopivimmat kodit", en: "Homes that fit you best", sv: "Bostäder som passar dig bäst" })}</h3>
          <div className="mt-6 grid gap-3">
            {results.map((a, i) => (
              <Link
                key={a.id}
                href={`/kohteet/kalliolinna?asunto=${a.id}`}
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
                      ? text({ fi: "Budjettisi sisällä · hyvät yhteydet", en: "Within your budget · good connections", sv: "Inom din budget · goda förbindelser" })
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
            {text({ fi: "Aloita uudelleen", en: "Start again", sv: "Börja om" })}
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
  const { text } = useLanguage();
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
              <p className="eyebrow">{text({ fi: "Koti löytyy elämästä käsin", en: "Start with the life you want", sv: "Börja med livet du vill leva" })}</p>
              <h1 className="display mt-5 max-w-2xl text-[3.15rem] leading-[.98] text-[#0d2d4e] sm:text-[4.8rem] lg:text-[5.5rem]">
                {text({ fi: "Löydä koti, joka sopii sinun elämääsi.", en: "Find a home that fits your life.", sv: "Hitta ett hem som passar ditt liv." })}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#536a81]">
                {text({ fi: "Yksi selkeä palvelu kodin löytämiseen ja asumisen arkeen — älykkäästi, saavutettavasti ja ihmisläheisesti.", en: "One clear service for finding a home and managing everyday living — smart, accessible and human.", sv: "En tydlig tjänst för att hitta en bostad och sköta vardagen — smart, tillgängligt och mänskligt." })}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex min-h-14 items-center gap-3 rounded-full bg-[#0a55df] px-6 font-bold text-white shadow-[0_14px_30px_rgba(10,85,223,.25)]">
                      {text({ fi: "Löydä koti", en: "Find a home", sv: "Hitta en bostad" })} <ArrowRight size={18} />
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
                  href="/oma-koti"
                  className="flex min-h-14 items-center rounded-full border border-[#ccd9e4] bg-white px-6 font-bold text-[#193b5e]"
                >
                  {text({ fi: "Olen jo asukas", en: "I am a resident", sv: "Jag är redan boende" })}
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative h-[390px] overflow-hidden rounded-[30px] border border-[#ded7c8] bg-[#f2ead8] shadow-[0_24px_70px_rgba(42,58,65,.14)] sm:h-[500px]"
            >
              <img
                src="/art/tuuma-editorial-courtyard.webp"
                alt="Nordic courtyard illustration with apartment building and residents"
                className="h-full w-full object-cover object-[68%_center]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,47,75,.04),transparent_45%,rgba(16,47,75,.64))]" />
              <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between">
                <span className="rounded-full border border-white/70 bg-[#fffdf8]/92 px-3 py-2 text-xs font-black text-[#31516f] shadow-sm">
                  Tuusula · yhteinen arki
                </span>
                <Link
                  href={`/kohteet/kalliolinna?asunto=${apartments[0].id}`}
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#102d4d] text-white shadow-lg"
                  aria-label="Avaa Kalliolinna"
                >
                  <ArrowRight size={17} />
                </Link>
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/60 bg-[#fffdf8]/92 p-4 shadow-lg backdrop-blur">
                <div className="flex items-end justify-between gap-4">
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
            {quick.map(({ icon: Icon, label, href }) => (
              <Link
                key={label.fi}
                href={href}
                className="group rounded-2xl border border-[#dde6ed] bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon size={20} className="text-[#0a55df]" />
                <span className="mt-4 block text-sm font-bold leading-5">
                  {text(label)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="shell py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[34px] bg-[#0d2e50] p-7 text-white sm:p-10">
            <p className="eyebrow !text-[#91bae5]">{text({ fi: "Etsitkö kotia?", en: "Looking for a home?", sv: "Söker du bostad?" })}</p>
            <h2 className="display mt-5 text-4xl sm:text-5xl">
              {text({ fi: "Kerro arjestasi. Me etsimme sopivat kodit.", en: "Tell us about your life. We will find the right homes.", sv: "Berätta om din vardag. Vi hittar bostäder som passar." })}
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-[#c7d8e9]">
              {text({ fi: "Smart Matcher huomioi perheen, liikkumisen, budjetin ja arjen tarpeet — eikä vain neliöitä.", en: "Smart Matcher considers household, mobility, budget and daily needs — not only square metres.", sv: "Smart Matcher beaktar hushåll, resor, budget och vardagsbehov — inte bara kvadratmeter." })}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <button className="mt-8 flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-[#123354]">
                  {text({ fi: "Löydä minulle koti", en: "Match me with a home", sv: "Hitta en bostad åt mig" })} <Sparkles size={17} />
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
            <Link href="/hakemukseni" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#a8cfff]">
              {text({ fi: "Seuraa hakemustasi", en: "Track your application", sv: "Följ din ansökan" })} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="rounded-[34px] bg-[#dfedff] p-7 sm:p-10">
            <p className="eyebrow">{text({ fi: "Oletko jo asukas?", en: "Already a resident?", sv: "Är du redan boende?" })}</p>
            <h2 className="display mt-5 text-4xl sm:text-5xl">
              {text({ fi: "Asumisen asiat ilman etsimistä.", en: "Everything about your home, easy to find.", sv: "Allt om ditt boende, lätt att hitta." })}
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-[#506b87]">
              {text({ fi: "Ohjattu huoltoapu, vuokratiedot, avaimet ja muutto yhdessä helposti hahmotettavassa palvelussa.", en: "Guided maintenance, rent details, keys and moving in one clear service.", sv: "Guidad service, hyresuppgifter, nycklar och flytt i en tydlig tjänst." })}
            </p>
            <Link
              href="/asukkaille"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0a55df] px-5 py-3 font-bold text-white"
            >
              {text({ fi: "Miten voimme auttaa?", en: "How can we help?", sv: "Hur kan vi hjälpa?" })} <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="shell pb-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">{text({ fi: "Vapaat kodit", en: "Available homes", sv: "Lediga bostäder" })}</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">
              {text({ fi: "Ajankohtaista juuri nyt", en: "Available right now", sv: "Ledigt just nu" })}
            </h2>
          </div>
          <Link
            href="/kohteet"
            className="hidden text-sm font-bold text-[#0a55df] sm:block"
          >
            {text({ fi: "Näytä kaikki →", en: "View all →", sv: "Visa alla →" })}
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {apartments.slice(0, 3).map((a) => (
            <Link
              key={a.id}
              href={`/kohteet/kalliolinna?asunto=${a.id}`}
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
    </main>
  );
}
