"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Home,
  RefreshCw,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { apartments } from "@/lib/data";
import { useLanguage } from "./LanguageProvider";

export function ApplicantPortal() {
  const { text } = useLanguage();
  const [complete, setComplete] = useState(false);
  const [extended, setExtended] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tuuma-application-demo") || "{}");
    queueMicrotask(() => {
      setComplete(Boolean(saved.complete));
      setExtended(Boolean(saved.extended));
    });
  }, []);

  function persist(next: { complete?: boolean; extended?: boolean }) {
    const state = {
      complete: next.complete ?? complete,
      extended: next.extended ?? extended,
    };
    localStorage.setItem("tuuma-application-demo", JSON.stringify(state));
  }

  const steps = [
    {
      title: text({ fi: "Hakemus vastaanotettu", en: "Application received", sv: "Ansökan mottagen" }),
      detail: "4.9.2026 · 09.42",
      state: "done",
    },
    {
      title: text({ fi: "Tiedot tarkistetaan", en: "Details under review", sv: "Uppgifterna granskas" }),
      detail: text({ fi: "Käsittelyssä", en: "In progress", sv: "Behandlas" }),
      state: "active",
    },
    {
      title: text({ fi: "Mahdollinen asuntotarjous", en: "Possible housing offer", sv: "Eventuellt bostadserbjudande" }),
      detail: text({ fi: "Saat ilmoituksen", en: "You will be notified", sv: "Du får ett meddelande" }),
      state: "next",
    },
    {
      title: text({ fi: "Päätös ja sopimus", en: "Decision and agreement", sv: "Beslut och avtal" }),
      detail: text({ fi: "Sähköinen vahvistus", en: "Digital confirmation", sv: "Digital bekräftelse" }),
      state: "next",
    },
  ];

  return (
    <main id="main" className="shell py-10 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="rounded-full bg-[#e5efff] px-3 py-2 text-[11px] font-black uppercase tracking-[.13em] text-[#0a55df]">Applicant portal · Demo</span>
          <h1 className="display mt-5 text-5xl sm:text-7xl">{text({ fi: "Hakemukseni", en: "My application", sv: "Min ansökan" })}</h1>
          <p className="mt-4 text-[#60758a]">TL-2026-1843 · {text({ fi: "Päivitetty hetki sitten", en: "Updated just now", sv: "Uppdaterad nyss" })}</p>
        </div>
        <Link href="/kohteet" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#cedae5] bg-white px-5 font-black text-[#274968]">
          {text({ fi: "Selaa muita koteja", en: "Browse other homes", sv: "Se andra bostäder" })} <ArrowRight size={17} />
        </Link>
      </div>

      {notice && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#e5f6ee] p-4 text-sm font-bold text-[#08705b]" role="status">
          <Check size={18} /> {notice}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-[30px] bg-white p-6 shadow-[0_18px_60px_rgba(20,52,84,.07)] sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{text({ fi: "Hakemuksen tila", en: "Application status", sv: "Ansökans status" })}</p>
              <h2 className="mt-3 text-2xl font-black">{text({ fi: "Tiedot tarkistetaan", en: "Details under review", sv: "Uppgifterna granskas" })}</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1dc] px-4 py-2 text-sm font-black text-[#8a5900]"><Clock3 size={16} /> {text({ fi: "Käsittelyssä", en: "In progress", sv: "Behandlas" })}</span>
          </div>

          <div className="mt-8 grid gap-0">
            {steps.map((step, index) => (
              <div key={step.title} className="grid grid-cols-[34px_1fr] gap-4">
                <div className="flex flex-col items-center">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 ${step.state === "done" ? "border-[#0a55df] bg-[#0a55df] text-white" : step.state === "active" ? "border-[#0a55df] bg-white text-[#0a55df]" : "border-[#ccd8e2] bg-white text-[#8a9bab]"}`}>
                    {step.state === "done" ? <Check size={17} /> : index + 1}
                  </span>
                  {index < steps.length - 1 && <span className={`h-14 w-0.5 ${step.state === "done" ? "bg-[#0a55df]" : "bg-[#dce5ed]"}`} />}
                </div>
                <div className="pb-6 pt-1">
                  <b className="block">{step.title}</b>
                  <small className="mt-1 block text-[#667b8f]">{step.detail}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl bg-[#f0f5f9] p-5 text-sm leading-6 text-[#526b82]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#0a55df]" size={19} />
              <p><b className="text-[#173b5e]">{text({ fi: "Reilu ja läpinäkyvä", en: "Fair and transparent", sv: "Rättvist och transparent" })}.</b> {text({ fi: "Asunnon match-prosentti kertoo vain, kuinka hyvin koti vastaa omia toiveitasi. Se ei vaikuta asukasvalinnan etusijaan tai muodosta jonopaikkaa.", en: "The match score only shows how well the home fits your preferences. It does not affect tenant-selection priority or create a queue position.", sv: "Matchningsgraden visar bara hur väl bostaden motsvarar dina önskemål. Den påverkar inte prioriteringen i valet av hyresgäst och är ingen köplats." })}</p>
            </div>
          </div>
        </section>

        <aside className="grid gap-6">
          <article className="overflow-hidden rounded-[30px] bg-[#102e4e] text-white">
            <img src={apartments[0].image} alt="Kalliolinna A12" className="h-44 w-full object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div><p className="text-xs font-bold uppercase tracking-[.13em] text-[#9ebbd6]">{text({ fi: "Haettu koti", en: "Applied home", sv: "Sökt bostad" })}</p><h2 className="mt-2 text-xl font-black">Kalliolinna A12</h2></div>
                <span className="rounded-full bg-[#dff7ee] px-3 py-2 text-xs font-black text-[#08705b]">94 % match</span>
              </div>
              <p className="mt-4 text-sm text-[#c5d8e8]">2h + kt · 56,5 m² · 790 €/kk</p>
            </div>
          </article>

          <article className={`rounded-[26px] p-6 ${complete ? "bg-[#e6f6ef]" : "bg-[#fff1dc]"}`}>
            <div className="flex items-start gap-3">
              {complete ? <CheckCircle2 className="shrink-0 text-[#08705b]" /> : <AlertCircle className="shrink-0 text-[#996200]" />}
              <div>
                <h2 className="font-black">{complete ? text({ fi: "Tiedot ovat ajan tasalla", en: "Details are up to date", sv: "Uppgifterna är aktuella" }) : text({ fi: "Yksi tieto puuttuu", en: "One detail is missing", sv: "En uppgift saknas" })}</h2>
                <p className="mt-2 text-sm leading-6 text-[#5b6f82]">{complete ? text({ fi: "Hakemus voidaan käsitellä ilman lisätoimia.", en: "The application can be processed without further action.", sv: "Ansökan kan behandlas utan fler åtgärder." }) : text({ fi: "Lisää viimeisin tulotosite tai vahvista nykyinen tilanteesi.", en: "Add your latest income statement or confirm your current situation.", sv: "Lägg till det senaste inkomstintyget eller bekräfta din situation." })}</p>
                {!complete && <button onClick={() => { setComplete(true); persist({ complete: true }); setNotice(text({ fi: "Demo-tosite lisättiin onnistuneesti", en: "Demo document added", sv: "Demointyget lades till" })); }} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-black text-[#614500]"><Upload size={16} /> {text({ fi: "Lisää tosite", en: "Add document", sv: "Lägg till intyg" })}</button>}
              </div>
            </div>
          </article>
        </aside>
      </div>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <article className="rounded-[28px] bg-[#dfeeff] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4"><FileText className="text-[#0a55df]" /><span className="text-sm font-black text-[#365b7d]">{complete ? "100 %" : "80 %"}</span></div>
          <h2 className="mt-5 text-xl font-black">{text({ fi: "Hakemuksen tiedot", en: "Application details", sv: "Ansökningsuppgifter" })}</h2>
          <Progress value={complete ? 100 : 80} className="mt-5" />
          <button onClick={() => setNotice(text({ fi: "Tietojen muokkaus avattiin demo-näkymässä", en: "Edit view opened in the demo", sv: "Redigeringsvyn öppnades i demon" }))} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0a55df]">{text({ fi: "Tarkista ja päivitä", en: "Review and update", sv: "Granska och uppdatera" })} <ArrowRight size={16} /></button>
        </article>
        <article className="rounded-[28px] bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between"><CalendarClock className="text-[#0a55df]" /><Bell size={19} className="text-[#6b8194]" /></div>
          <h2 className="mt-5 text-xl font-black">{text({ fi: "Hakemus voimassa", en: "Application valid until", sv: "Ansökan gäller till" })}</h2>
          <p className="mt-2 text-2xl font-black">{extended ? "22.10.2026" : "22.9.2026"}</p>
          <button disabled={extended} onClick={() => { setExtended(true); persist({ extended: true }); setNotice(text({ fi: "Hakemuksen voimassaoloa jatkettiin", en: "Application validity extended", sv: "Ansökans giltighet förlängdes" })); }} className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#cfdae4] px-4 py-3 text-sm font-black disabled:opacity-45"><RefreshCw size={16} /> {extended ? text({ fi: "Voimassaoloa jatkettu", en: "Validity extended", sv: "Giltigheten förlängd" }) : text({ fi: "Jatka voimassaoloa", en: "Extend validity", sv: "Förläng giltigheten" })}</button>
        </article>
      </section>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#d9e3eb] bg-white p-5 text-sm leading-6 text-[#61768a]">
        <Home className="mt-0.5 shrink-0 text-[#0a55df]" size={18} />
        <p>{text({ fi: "Konseptissa uusi asiakasnäkymä näyttää Tampuurista saadun tilan selkeästi. Henkilö- ja hakemustiedot pysyvät nykyisessä taustajärjestelmässä.", en: "In this concept, the new customer view presents status received from Tampuuri. Personal and application data remain in the existing back-office system.", sv: "I konceptet visar den nya kundvyn status från Tampuuri på ett tydligt sätt. Person- och ansökningsuppgifterna stannar i det befintliga bakgrundssystemet." })}</p>
      </div>
    </main>
  );
}
