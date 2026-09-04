"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  CloudSun,
  Droplets,
  FileClock,
  Leaf,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  ThermometerSun,
  Wind,
  Zap,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const history = [42, 39, 45, 48, 43, 41, 44, 40, 38, 41, 43, 41];

export function EnergyDashboard() {
  const { text } = useLanguage();
  const [period, setPeriod] = useState<"week" | "month">("month");
  const [notice, setNotice] = useState("");

  return (
    <main id="main" className="shell py-10 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="rounded-full bg-[#e6f6ef] px-3 py-2 text-[11px] font-black uppercase tracking-[.13em] text-[#08705b]">Energy & indoor climate · Demo</span>
          <h1 className="display mt-5 text-5xl sm:text-7xl">{text({ fi: "Hyvä sisäilma näkyväksi", en: "Make indoor climate visible", sv: "Gör inomhusklimatet synligt" })}</h1>
          <p className="mt-4 text-[#60758a]">Kalliolinna A12 · {text({ fi: "Päivitetty 2 min sitten", en: "Updated 2 min ago", sv: "Uppdaterad för 2 min sedan" })}</p>
        </div>
        <div className="flex rounded-full bg-white p-1" role="group" aria-label={text({ fi: "Ajanjakso", en: "Period", sv: "Period" })}>{(["week", "month"] as const).map((item) => <button key={item} onClick={() => setPeriod(item)} className={`min-h-11 rounded-full px-5 text-sm font-black ${period === item ? "bg-[#102e4e] text-white" : "text-[#5d7388]"}`}>{item === "week" ? text({ fi: "Viikko", en: "Week", sv: "Vecka" }) : text({ fi: "Kuukausi", en: "Month", sv: "Månad" })}</button>)}</div>
      </div>

      {notice && <div className="mt-6 flex items-center gap-2 rounded-2xl bg-[#e6f6ef] p-4 text-sm font-black text-[#08705b]" role="status"><CheckCircle2 size={18} />{notice}</div>}

      <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Metric icon={ThermometerSun} label={text({ fi: "Lämpötila", en: "Temperature", sv: "Temperatur" })} value="21,4 °C" detail={text({ fi: "Tavoitealueella", en: "Within target", sv: "Inom målområdet" })} tone="blue" />
        <Metric icon={Droplets} label={text({ fi: "Ilmankosteus", en: "Humidity", sv: "Luftfuktighet" })} value="41 %" detail={text({ fi: "Tasainen", en: "Stable", sv: "Stabil" })} tone="blue" />
        <Metric icon={Wind} label="CO₂" value="690 ppm" detail={text({ fi: "Hyvä ilmanvaihto", en: "Good ventilation", sv: "God ventilation" })} tone="green" />
        <Metric icon={Leaf} label={text({ fi: "Energialuokka", en: "Energy class", sv: "Energiklass" })} value="B" detail={text({ fi: "Todistus 2025–2035 · demo", en: "Certificate 2025–2035 · demo", sv: "Certifikat 2025–2035 · demo" })} tone="green" />
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <article className="rounded-[30px] bg-white p-6 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">{text({ fi: "Sisäilman historia", en: "Indoor climate history", sv: "Historik för inomhusklimat" })}</p><h2 className="mt-3 text-2xl font-black">{text({ fi: "Kosteus pysyy suositusalueella", en: "Humidity stays within the target range", sv: "Luftfuktigheten hålls inom målområdet" })}</h2></div><span className="rounded-full bg-[#e6f6ef] px-4 py-2 text-sm font-black text-[#08705b]">36–48 %</span></div>
          <div className="mt-10 flex h-56 items-end gap-2" role="img" aria-label={text({ fi: "Kosteushistorian pylväskaavio", en: "Humidity history bar chart", sv: "Stapeldiagram över luftfuktighet" })}>{history.slice(period === "week" ? 5 : 0).map((value, index) => <div key={`${value}-${index}`} className="group flex h-full flex-1 items-end"><div className="relative w-full rounded-t-xl bg-[#8ac2ff] transition hover:bg-[#0a55df]" style={{ height: `${Math.max(26, value * 1.7)}%` }}><span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 text-xs font-black group-hover:block">{value}%</span></div></div>)}</div>
          <div className="mt-4 flex justify-between text-xs font-bold text-[#6b7f92]"><span>{period === "week" ? text({ fi: "Ma", en: "Mon", sv: "Mån" }) : "1.9."}</span><span>{text({ fi: "Nyt", en: "Now", sv: "Nu" })}</span></div>
        </article>

        <aside className="grid gap-5">
          <article className="rounded-[28px] bg-[#0d2e50] p-6 text-white">
            <CloudSun className="text-[#77b8f6]" />
            <p className="eyebrow mt-7 !text-[#91b8df]">{text({ fi: "Tämän päivän vinkki", en: "Today's tip", sv: "Dagens tips" })}</p>
            <h2 className="mt-3 text-xl font-black">{text({ fi: "Tuuleta nopeasti ja tehokkaasti", en: "Ventilate briefly and efficiently", sv: "Vädra kort och effektivt" })}</h2>
            <p className="mt-3 text-sm leading-6 text-[#c4d7e8]">{text({ fi: "5–10 minuutin ristiveto vaihtaa ilman ilman, että rakenteet ehtivät jäähtyä.", en: "A 5–10 minute cross-breeze refreshes the air without cooling the structures.", sv: "Korsdrag i 5–10 minuter byter luften utan att konstruktionerna hinner kylas ner." })}</p>
          </article>
          <article className="rounded-[28px] bg-[#fff1dc] p-6">
            <Lightbulb className="text-[#8a5900]" />
            <h2 className="mt-5 font-black">{text({ fi: "Tuntuuko silti kylmältä tai kostealta?", en: "Still feels cold or damp?", sv: "Känns det ändå kallt eller fuktigt?" })}</h2>
            <p className="mt-3 text-sm leading-6 text-[#6f5b37]">{text({ fi: "Liitä tämän näkymän mittaustiedot huoltopyyntöön, jotta selvitys alkaa paremmilla tiedoilla.", en: "Attach these readings to a maintenance request so troubleshooting starts with better information.", sv: "Bifoga mätvärdena till serviceanmälan så att utredningen börjar med bättre information." })}</p>
            <Link href="/huolto" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-black text-[#70501a]">{text({ fi: "Tee havainto", en: "Report an observation", sv: "Rapportera observation" })}<ArrowRight size={16} /></Link>
          </article>
        </aside>
      </section>

      <section className="mt-5 rounded-[32px] bg-[#dfeeff] p-6 sm:p-9">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">{text({ fi: "Talon digitaalinen huoltokirja", en: "Digital building logbook", sv: "Digital servicebok för huset" })}</p><h2 className="display mt-3 text-4xl sm:text-5xl">{text({ fi: "Mitä talossa parannetaan seuraavaksi?", en: "What is being improved next?", sv: "Vad förbättras härnäst i huset?" })}</h2></div><Building2 className="text-[#0a55df]" size={30} /></div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[{ icon: CalendarClock, date: "10/2026", fi: "Ilmanvaihdon tasapainotus", en: "Ventilation balancing", sv: "Balansering av ventilation" }, { icon: Zap, date: "01/2027", fi: "Yleisten tilojen LED-ohjaus", en: "LED controls in shared areas", sv: "LED-styrning i gemensamma utrymmen" }, { icon: FileClock, date: "2027", fi: "Energiatehokkuuden seuranta", en: "Energy efficiency review", sv: "Uppföljning av energieffektivitet" }].map((item) => { const Icon = item.icon; return <article key={item.fi} className="rounded-2xl bg-white p-5"><Icon className="text-[#0a55df]" size={20} /><span className="mt-5 block text-xs font-black text-[#60758a]">{item.date}</span><h3 className="mt-2 font-black">{text({ fi: item.fi, en: item.en, sv: item.sv })}</h3></article>; })}
        </div>
      </section>

      <section className="mt-5 grid gap-5 sm:grid-cols-2">
        <article className="rounded-[28px] bg-white p-6"><div className="flex items-start gap-4"><ShieldCheck className="mt-1 shrink-0 text-[#0a55df]" /><div><h2 className="font-black">{text({ fi: "Yksityisyys ensin", en: "Privacy first", sv: "Integritet först" })}</h2><p className="mt-3 text-sm leading-6 text-[#60758a]">{text({ fi: "Asukkaan näkymä näyttää vain hänen omaan kotiinsa liittyvät tiedot. Talotason analytiikka muodostetaan ilman henkilötason profilointia.", en: "The resident sees only data related to their home. Building-level analytics are produced without personal profiling.", sv: "Den boende ser bara uppgifter som gäller det egna hemmet. Analys på husnivå görs utan personprofilering." })}</p></div></div></article>
        <article className="rounded-[28px] bg-white p-6"><div className="flex items-start gap-4"><Sparkles className="mt-1 shrink-0 text-[#0a55df]" /><div><h2 className="font-black">{text({ fi: "Progressive enhancement", en: "Progressive enhancement", sv: "Progressiv förbättring" })}</h2><p className="mt-3 text-sm leading-6 text-[#60758a]">{text({ fi: "Jos anturidataa ei ole, palvelu näyttää energiatodistuksen, huoltohistorian ja selkeät toimintaohjeet ilman tyhjää näkymää.", en: "When sensor data is unavailable, the service still shows the energy certificate, maintenance history and useful guidance.", sv: "Om sensordata saknas visar tjänsten fortfarande energicertifikat, servicehistorik och tydliga anvisningar." })}</p></div></div></article>
      </section>

      <button onClick={() => setNotice(text({ fi: "Energiaraportti valmisteltiin demo-näkymässä", en: "Energy report prepared in the demo", sv: "Energirapporten förbereddes i demon" }))} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0a55df] px-5 py-3 text-sm font-black text-white">{text({ fi: "Lataa kodin raportti", en: "Download home report", sv: "Ladda ner hemmets rapport" })}<ArrowRight size={16} /></button>
    </main>
  );
}

function Metric({ icon: Icon, label, value, detail, tone }: { icon: typeof ThermometerSun; label: string; value: string; detail: string; tone: "blue" | "green" }) {
  return <article className="rounded-[26px] bg-white p-6"><div className={`grid h-11 w-11 place-items-center rounded-2xl ${tone === "green" ? "bg-[#e6f6ef] text-[#08705b]" : "bg-[#e6f1ff] text-[#0a55df]"}`}><Icon size={20} /></div><p className="mt-6 text-sm font-bold text-[#64788c]">{label}</p><strong className="mt-2 block text-3xl tracking-[-.04em]">{value}</strong><span className={`mt-3 inline-flex items-center gap-2 text-xs font-black ${tone === "green" ? "text-[#08705b]" : "text-[#35618a]"}`}><CheckCircle2 size={15} />{detail}</span></article>;
}

