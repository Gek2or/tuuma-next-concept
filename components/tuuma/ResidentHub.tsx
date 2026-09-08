"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  ChevronRight,
  CircleDollarSign,
  FileText,
  KeyRound,
  PackageOpen,
  Recycle,
  ShieldCheck,
  ShowerHead,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const help = [
  { id: "fault", icon: Wrench, label: { fi: "Asunnossa on vika", en: "Something is broken", sv: "Något är fel i bostaden" }, href: "/huolto" },
  { id: "rent", icon: CircleDollarSign, label: { fi: "Vuokra ja maksut", en: "Rent and payments", sv: "Hyra och betalningar" }, href: "/oma-koti#payments" },
  { id: "keys", icon: KeyRound, label: { fi: "Avaimet", en: "Keys", sv: "Nycklar" } },
  { id: "parking", icon: Car, label: { fi: "Autopaikka", en: "Parking", sv: "Bilplats" }, href: "/oma-koti#bookings" },
  { id: "movein", icon: PackageOpen, label: { fi: "Muutto sisään", en: "Moving in", sv: "Inflyttning" }, href: "/muutto" },
  { id: "moveout", icon: PackageOpen, label: { fi: "Muutto pois", en: "Moving out", sv: "Utflyttning" }, href: "/muutto" },
  { id: "sauna", icon: ShowerHead, label: { fi: "Sauna", en: "Sauna", sv: "Bastu" }, href: "/oma-koti#bookings" },
  { id: "recycling", icon: Recycle, label: { fi: "Kierrätys", en: "Recycling", sv: "Återvinning" } },
  { id: "rules", icon: ShieldCheck, label: { fi: "Järjestyssäännöt", en: "House rules", sv: "Ordningsregler" } },
  { id: "forms", icon: FileText, label: { fi: "Lomakkeet", en: "Forms", sv: "Blanketter" } },
] as const;

export function ResidentHub() {
  const { text } = useLanguage();
  const [selected, setSelected] = useState<(typeof help)[number]>();
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState("");

  const steps = [
    text({ fi: "Valitse tarkempi tilanne", en: "Choose the specific situation", sv: "Välj den exakta situationen" }),
    text({ fi: "Tarkista talokohtainen ohje", en: "Review building-specific guidance", sv: "Läs den husspecifika anvisningen" }),
    text({ fi: "Valitse seuraava toimenpide", en: "Choose the next action", sv: "Välj nästa åtgärd" }),
  ];

  return (
    <section className="shell py-12 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <p className="eyebrow">{text({ fi: "Asukkaan palvelukeskus", en: "Resident service centre", sv: "Servicecenter för boende" })}</p>
          <h1 className="display mt-4 text-5xl sm:text-7xl">{text({ fi: "Miten voimme auttaa?", en: "How can we help?", sv: "Hur kan vi hjälpa?" })}</h1>
          <p className="mt-5 text-lg leading-8 text-[#5e748b]">
            {text({
              fi: "Valitse tilanteesi. Palvelu näyttää olennaisen ohjeen ja oikean seuraavan askeleen.",
              en: "Choose your situation. The service shows the relevant guidance and the right next step.",
              sv: "Välj din situation. Tjänsten visar rätt anvisning och nästa steg.",
            })}
          </p>
        </div>
        <Link href="/oma-koti" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0a55df] px-5 text-sm font-black text-white">
          {text({ fi: "Avaa Oma koti", en: "Open My home", sv: "Öppna Mitt hem" })}<ArrowRight size={17} />
        </Link>
      </div>

      <div className="mt-9 grid overflow-hidden rounded-[30px] border border-[#dfe6e9] bg-[#f6f3ec] md:grid-cols-[.92fr_1.08fr]">
        <img src="/art/editorial-resident-care-v1.webp" alt={text({ fi: "Asukas ja huoltotyöntekijä kodin ovella", en: "Resident and maintenance worker at a home entrance", sv: "Boende och servicetekniker vid hemmets dörr" })} className="h-64 w-full object-cover md:h-full" loading="lazy" decoding="async" />
        <div className="p-7 sm:p-9">
          <p className="eyebrow">{text({ fi: "Yksi tilanne kerrallaan", en: "One situation at a time", sv: "En situation i taget" })}</p>
          <h2 className="display mt-3 max-w-lg text-4xl text-[#173655]">{text({ fi: "Hyvä palvelu tuntuu siltä, että joku tietää mitä tehdä seuraavaksi.", en: "Good service feels like someone knows what to do next.", sv: "Bra service känns som att någon vet vad som ska hända härnäst." })}</h2>
          <p className="mt-4 max-w-lg leading-7 text-[#5e748b]">{text({ fi: "Tässä konseptissa ohje, yhteydenottokanava ja seuraava toimenpide ovat aina samassa paikassa.", en: "In this concept, guidance, contact channel and the next action are always in the same place.", sv: "I det här konceptet finns anvisning, kontaktkanal och nästa åtgärd alltid på samma plats." })}</p>
        </div>
      </div>

      {notice && <div className="mt-6 rounded-2xl bg-[#e6f6ef] p-4 text-sm font-black text-[#08705b]" role="status">{notice}</div>}

      {!selected ? (
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {help.map((item) => {
            const Icon = item.icon;
            const card = (
              <>
                <Icon className="text-[#0a55df]" />
                <span className="flex items-end justify-between gap-3 font-black leading-5">
                  {text(item.label)}
                  <ChevronRight className="shrink-0" size={18} />
                </span>
              </>
            );
            const className = "group flex min-h-40 flex-col justify-between rounded-[24px] border border-[#dce5ed] bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#8eb4db] hover:shadow-xl";
            return "href" in item && item.href ? (
              <Link key={item.id} href={item.href} className={className}>{card}</Link>
            ) : (
              <button key={item.id} onClick={() => { setSelected(item); setStep(0); }} className={className}>{card}</button>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
          <aside className="rounded-[28px] bg-[#dfeeff] p-7">
            <button onClick={() => setSelected(undefined)} className="flex items-center gap-2 text-sm font-black text-[#355a7d]">
              <ArrowLeft size={17} />{text({ fi: "Kaikki aiheet", en: "All topics", sv: "Alla ämnen" })}
            </button>
            <p className="eyebrow mt-9">{text({ fi: "Valittu aihe", en: "Selected topic", sv: "Valt ämne" })}</p>
            <h2 className="display mt-3 text-4xl">{text(selected.label)}</h2>
            <div className="mt-8 grid gap-3">
              {steps.map((label, index) => (
                <button key={label} onClick={() => setStep(index)} className={["flex items-center gap-3 rounded-2xl p-4 text-left text-sm font-bold", index === step ? "bg-white text-[#0a55df]" : "text-[#536c84]"].join(" ")}>
                  <span className={["grid h-7 w-7 shrink-0 place-items-center rounded-full", index <= step ? "bg-[#0a55df] text-white" : "bg-white"].join(" ")}>{index + 1}</span>
                  {label}
                </button>
              ))}
            </div>
          </aside>
          <div className="rounded-[28px] bg-white p-7 sm:p-10">
            <div className="flex items-center gap-2 text-[#0a55df]"><Sparkles size={18} /><span className="eyebrow !text-[#0a55df]">{text({ fi: "Ohjattu asiointi", en: "Guided service", sv: "Guidad service" })}</span></div>
            <h3 className="display mt-5 text-4xl">{steps[step]}</h3>
            <p className="mt-5 max-w-xl leading-7 text-[#60758a]">
              {step === 0
                ? text({ fi: "Valitse vaihtoehto, joka kuvaa tilannettasi parhaiten.", en: "Choose the option that best describes your situation.", sv: "Välj det alternativ som bäst beskriver din situation." })
                : step === 1
                  ? text({ fi: "Tässä tuotanto näyttäisi juuri tämän talon hyväksytyn ohjeen, yhteystiedot ja mahdolliset poikkeukset.", en: "In production, this shows approved guidance, contacts and exceptions for this building.", sv: "I produktion visas godkända anvisningar, kontakter och undantag för just detta hus." })
                  : text({ fi: "Voit tallentaa ohjeen, siirtyä oikeaan lomakkeeseen tai pyytää asiakaspalvelua jatkamaan.", en: "Save the guidance, open the correct form or ask customer service to continue.", sv: "Spara anvisningen, öppna rätt blankett eller be kundtjänsten fortsätta." })}
            </p>
            {step === 0 ? (
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <button onClick={() => setStep(1)} className="rounded-2xl border border-[#d6e1ea] p-5 text-left font-black hover:bg-[#f0f6fb]">{text({ fi: "Tarvitsen ohjeen", en: "I need guidance", sv: "Jag behöver en anvisning" })}</button>
                <button onClick={() => setStep(2)} className="rounded-2xl bg-[#e7f1ff] p-5 text-left font-black text-[#174d84]">{text({ fi: "Haluan tehdä ilmoituksen", en: "I want to submit a request", sv: "Jag vill skicka ett ärende" })}</button>
              </div>
            ) : (
              <div className="mt-7 rounded-2xl bg-[#edf4f9] p-5">
                <b className="block">{text({ fi: "Talokohtainen demo-ohje", en: "Building-specific demo guidance", sv: "Husspecifik demoanvisning" })}</b>
                <p className="mt-2 text-sm leading-6 text-[#60758a]">{text({ fi: "Ohjeen omistaja, viimeinen tarkistuspäivä ja kieliversiot näkyvät aina käyttäjälle.", en: "The guidance owner, review date and language versions are always visible.", sv: "Anvisningens ägare, granskningsdatum och språkversioner visas alltid." })}</p>
              </div>
            )}
            <div className="mt-7 flex flex-wrap justify-end gap-3">
              {step > 0 && <button onClick={() => setStep(step - 1)} className="rounded-full px-5 py-3 text-sm font-black text-[#526b82]">{text({ fi: "Takaisin", en: "Back", sv: "Tillbaka" })}</button>}
              <button onClick={() => step < 2 ? setStep(step + 1) : setNotice(text({ fi: "Pyyntö valmisteltiin demo-näkymässä", en: "Request prepared in the demo", sv: "Ärendet förbereddes i demon" }))} className="flex items-center gap-2 rounded-full bg-[#0a55df] px-6 py-3 font-black text-white">
                {step < 2 ? text({ fi: "Jatka", en: "Continue", sv: "Fortsätt" }) : text({ fi: "Valmistele pyyntö", en: "Prepare request", sv: "Förbered ärende" })}<ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
