"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { apartments } from "@/lib/data";
import { matchHome } from "@/lib/matcher";
import { useLanguage } from "./LanguageProvider";
import { ThreeHomeCards } from "./ShowcaseHomes";
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
      { value: "1200", label: { fi: "enintään 1 200 €", en: "up to €1,200", sv: "högst 1 200 €" } },
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
        .map(a => matchHome(a, answers))
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
          <div className="flex items-center gap-3 text-[#3d4785]">
            <Sparkles />
            <span className="eyebrow !text-[#3d4785]">{text({ fi: "Älykäs suositus", en: "Smart recommendation", sv: "Smart rekommendation" })}</span>
          </div>
          <h3 className="display mt-4 text-3xl">{text({ fi: "Sinulle sopivimmat kodit", en: "Homes that fit you best", sv: "Bostäder som passar dig bäst" })}</h3>
          <div className="mt-6 grid gap-3">
            {results.map((a) => (
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
                  <p className="mt-1 text-xs font-semibold text-[#315b88]">
                    {a.reasons.slice(0, 2).map(reason => text(reason)).join(" · ")}
                    {a.tradeoffs.length > 0 && <span className="mt-1 block text-amber-800">{text(a.tradeoffs[0])}</span>}
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
            className="mt-5 text-sm font-bold text-[#3d4785]"
          >
            {text({ fi: "Aloita uudelleen", en: "Start again", sv: "Börja om" })}
          </button>
        </>
      )}
    </div>
  );
}

export function HomeExperience() {
  const {text} = useLanguage();
  const t=(fi:string,en:string,sv:string)=>text({fi,en,sv});
  return <main id="main">
    <section className="shell grid items-center gap-8 py-10 sm:py-16 lg:grid-cols-[1.05fr_.95fr]">
      <div><p className="eyebrow">TUUSULA · HYRYLÄ · JOKELA · KELLOKOSKI</p>
      <h1 className="display mt-6 max-w-2xl text-5xl leading-[1.05] text-[#22264b] sm:text-6xl lg:text-7xl">{t("Löydä koti, joka sopii sinun elämääsi.","Find a home that fits your life.","Hitta ett hem som passar ditt liv.")}</h1>
      <p className="mt-6 max-w-lg text-lg leading-8 text-[#62677f]">{t("Tutustu koteihin Tuusulassa. Vertaa vaihtoehtoja ja löydä oma paikkasi.","Explore homes in Tuusula. Compare your options and find your own place.","Utforska hem i Tusby. Jämför alternativen och hitta din egen plats.")}</p>
      <div className="mt-8 flex flex-wrap gap-3"><Link href="/kohteet" className="showcase-primary px-7">{t("Etsi asunto","Find an apartment","Sök bostad")}<ArrowRight size={18}/></Link><Link href="/asukkaille" className="inline-flex min-h-13 items-center rounded-xl border border-[#d8dae5] px-6 font-bold">{t("Olen jo asukas","I am a resident","Jag är redan boende")}</Link></div></div>
      <img src="/art/tuuma-neighborhood-ink-v2.webp" width="1536" height="1024" alt={t("Kuvitettu Tuusulan naapurusto","Illustrated Tuusula neighbourhood","Illustrerat grannskap i Tusby")} className="mx-auto w-full max-w-xl"/>
    </section>
    <div className="border-y border-[#e6e7ee] bg-[#f7f7fb]"><ThreeHomeCards/></div>
    <section className="shell py-12 sm:py-16">
      <div className="grid items-center gap-7 rounded-2xl border border-[#d8dae5] p-6 sm:p-9 md:grid-cols-[1fr_auto]">
        <div><h2 className="text-2xl font-extrabold">{t("Etkö vielä tiedä, millaista kotia etsit?","Not sure which home suits you?","Vet du ännu inte vilket hem som passar?")}</h2><p className="mt-3 max-w-2xl text-base leading-7 text-[#62677f]">{t("Vastaa muutamaan kysymykseen. Saat ehdotuksia budjettisi, perheesi ja arjen tarpeiden perusteella.","Answer a few questions for suggestions based on your budget, household and everyday needs.","Svara på några frågor och få förslag utifrån din budget, ditt hushåll och din vardag.")}</p></div>
        <Dialog><DialogTrigger asChild><button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#3d4785] px-5 font-bold text-[#3d4785]">{t("Auta valitsemaan","Help me choose","Hjälp mig välja")}<Sparkles size={17}/></button></DialogTrigger><DialogContent className="max-h-[90svh] overflow-auto p-6 sm:max-w-2xl sm:p-9"><DialogHeader><DialogTitle>{t("Löydä sopiva koti","Find your match","Hitta ett passande hem")}</DialogTitle><DialogDescription>{t("Toiveesi ohjaavat suosituksia.","Your preferences guide the suggestions.","Dina önskemål styr förslagen.")}</DialogDescription></DialogHeader><Matcher/></DialogContent></Dialog>
      </div>
    </section>
    <section className="shell grid items-center gap-8 pb-12 sm:pb-16 md:grid-cols-2"><img src="/art/tuusula-editorial-area.webp" width="1536" height="1024" loading="lazy" className="aspect-[3/2] w-full rounded-2xl object-cover" alt={t("Tuusulan alueen kuvitus","Tuusula area illustration","Illustration av Tusbyområdet")}/><div><p className="eyebrow">{t("Tutustu alueisiin","Get to know the areas","Lär känna områdena")}</p><h2 className="display mt-4 text-4xl">{t("Koti jatkuu ulko-oven toisella puolella.","A home goes beyond your front door.","Hemmet fortsätter utanför dörren.")}</h2><p className="mt-5 text-base leading-7 text-[#62677f]">{t("Hyrylä, Jokela vai Kellokoski? Tutustu palveluihin ja lähiympäristöön ennen valintaa.","Hyrylä, Jokela or Kellokoski? Explore local services and surroundings before choosing.","Hyrylä, Jokela eller Kellokoski? Utforska service och närmiljö före ditt val.")}</p><Link href="/alueet" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4">{t("Tutustu kolmeen alueeseen","Explore the three areas","Utforska de tre områdena")}<ArrowRight size={17}/></Link></div></section>
  </main>;
}
