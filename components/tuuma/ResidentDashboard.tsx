"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Car,
  Check,
  ChevronRight,
  CircleDollarSign,
  Download,
  Droplets,
  FileText,
  Gauge,
  Home,
  KeyRound,
  MessageSquare,
  ShowerHead,
  Sparkles,
  ThermometerSun,
  Users,
  WashingMachine,
  Wrench,
  Zap,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function ResidentDashboard() {
  const { text } = useLanguage();
  const [notice, setNotice] = useState("");
  const [booked, setBooked] = useState("");

  const show = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  };

  return (
    <main id="main" className="shell py-10 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="rounded-full bg-[#e5efff] px-3 py-2 text-[11px] font-black uppercase tracking-[.13em] text-[#0a55df]">Resident account · Demo</span>
          <h1 className="display mt-5 text-5xl sm:text-7xl">{text({ fi: "Hei, Emilia", en: "Hello, Emilia", sv: "Hej, Emilia" })}</h1>
          <p className="mt-4 text-[#60758a]">Kalliolinna A12 · Kalliorinteentie 8</p>
        </div>
        <Link href="/asukkaille" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#cfdae4] bg-white px-5 font-black text-[#274866]">
          {text({ fi: "Kaikki ohjeet", en: "All guidance", sv: "Alla anvisningar" })} <ArrowRight size={17} />
        </Link>
      </div>

      {notice && <div className="fixed left-1/2 top-24 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#0d2e50] px-5 py-3 text-sm font-black text-white shadow-xl" role="status"><Check size={17} />{notice}</div>}

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <article id="payments" className="rounded-[32px] bg-[#0d2e50] p-6 text-white sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="eyebrow !text-[#91b8df]">{text({ fi: "Seuraava vuokra", en: "Next rent", sv: "Nästa hyra" })}</p>
              <p className="mt-5 text-4xl font-black tracking-[-.04em]">790,00 €</p>
              <p className="mt-2 text-sm text-[#c3d6e8]">{text({ fi: "Eräpäivä 2.10.2026", en: "Due 2 Oct 2026", sv: "Förfaller 2.10.2026" })}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#dbf6ec] px-4 py-2 text-sm font-black text-[#08705b]"><Check size={16} /> {text({ fi: "Ei avoimia maksuja", en: "No outstanding payments", sv: "Inga obetalda avgifter" })}</span>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <button onClick={() => show(text({ fi: "Maksutiedot avattu", en: "Payment details opened", sv: "Betalningsuppgifter öppnade" }))} className="rounded-2xl bg-white px-4 py-4 text-left text-sm font-black text-[#123455]"><CircleDollarSign className="mb-4 text-[#0a55df]" size={20} />{text({ fi: "Maksutiedot", en: "Payment details", sv: "Betalningsuppgifter" })}</button>
            <button onClick={() => show(text({ fi: "Vuokrasopimus avattu demo-näkymässä", en: "Lease opened in the demo", sv: "Hyresavtalet öppnades i demon" }))} className="rounded-2xl bg-white/8 px-4 py-4 text-left text-sm font-black"><FileText className="mb-4 text-[#7eb8f4]" size={20} />{text({ fi: "Vuokrasopimus", en: "Lease", sv: "Hyresavtal" })}</button>
            <Link href="/kustannukset" className="rounded-2xl bg-white/8 px-4 py-4 text-left text-sm font-black"><Gauge className="mb-4 text-[#7eb8f4]" size={20} />{text({ fi: "Kuukausikustannus", en: "Monthly cost", sv: "Månadskostnad" })}</Link>
          </div>
        </article>

        <article className="rounded-[32px] bg-[#dfeeff] p-6 sm:p-8">
          <div className="flex items-center justify-between"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#0a55df]"><Bell size={20} /></div><span className="rounded-full bg-[#0a55df] px-3 py-2 text-xs font-black text-white">2</span></div>
          <h2 className="mt-6 text-2xl font-black">{text({ fi: "Talosi ajankohtaista", en: "Your building updates", sv: "Aktuellt i ditt hus" })}</h2>
          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl bg-white p-4"><b className="text-sm">{text({ fi: "Vedenjakelun huolto", en: "Water supply maintenance", sv: "Underhåll av vattenförsörjningen" })}</b><p className="mt-1 text-sm text-[#60758a]">12.9. · 09–12</p></div>
            <div className="rounded-2xl bg-white p-4"><b className="text-sm">{text({ fi: "Syystalkoot pihalla", en: "Autumn yard day", sv: "Hösttalko på gården" })}</b><p className="mt-1 text-sm text-[#60758a]">20.9. · 16.30</p></div>
          </div>
        </article>
      </section>

      <section className="mt-5 grid gap-5 md:grid-cols-3">
        <Link href="/huolto" className="group rounded-[28px] bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between"><Wrench className="text-[#0a55df]" /><ChevronRight className="text-[#7b8fa2] transition group-hover:translate-x-1" /></div>
          <h2 className="mt-8 text-xl font-black">Huolto Live</h2>
          <p className="mt-2 text-sm leading-6 text-[#60758a]">{text({ fi: "Tee pyyntö ja seuraa käyntiaikaa reaaliajassa.", en: "Submit a request and follow the visit status.", sv: "Gör en anmälan och följ besökets status." })}</p>
          <div className="mt-5 rounded-2xl bg-[#fff1dc] p-4"><span className="text-xs font-black text-[#845800]">HUOLTO-1042</span><p className="mt-1 text-sm font-bold">{text({ fi: "Käsittelyssä · arvio huomenna 10–12", en: "In progress · estimated tomorrow 10–12", sv: "Behandlas · uppskattat i morgon 10–12" })}</p></div>
        </Link>
        <Link href="/energia" className="group rounded-[28px] bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between"><ThermometerSun className="text-[#0a55df]" /><ChevronRight className="text-[#7b8fa2] transition group-hover:translate-x-1" /></div>
          <h2 className="mt-8 text-xl font-black">{text({ fi: "Energia ja sisäilma", en: "Energy and indoor climate", sv: "Energi och inomhusklimat" })}</h2>
          <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#eef5fa] p-4"><ThermometerSun size={17} className="text-[#0a55df]" /><b className="mt-3 block text-xl">21,4 °C</b></div><div className="rounded-2xl bg-[#eef5fa] p-4"><Droplets size={17} className="text-[#0a55df]" /><b className="mt-3 block text-xl">41 %</b></div></div>
        </Link>
        <Link href="/muutto" className="group rounded-[28px] bg-[#e6f1ff] p-6 transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between"><KeyRound className="text-[#0a55df]" /><ChevronRight className="text-[#7b8fa2] transition group-hover:translate-x-1" /></div>
          <h2 className="mt-8 text-xl font-black">{text({ fi: "Muutto ja avaimet", en: "Moving and keys", sv: "Flytt och nycklar" })}</h2>
          <p className="mt-2 text-sm leading-6 text-[#60758a]">{text({ fi: "Tarkistuslistat sisään- ja poismuuttoon.", en: "Checklists for moving in and out.", sv: "Checklistor för in- och utflyttning." })}</p>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#0a55df]">{text({ fi: "Avaa muuttoapuri", en: "Open moving guide", sv: "Öppna flyttguiden" })}<ArrowRight size={16} /></span>
        </Link>
      </section>

      <section id="bookings" className="mt-5 rounded-[32px] bg-white p-6 sm:p-9">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow">{text({ fi: "Varaukset ja jonot", en: "Bookings and queues", sv: "Bokningar och köer" })}</p><h2 className="display mt-3 text-4xl">{text({ fi: "Talosi yhteiset palvelut", en: "Shared services in your building", sv: "Gemensamma tjänster i huset" })}</h2></div>
          <CalendarDays className="text-[#0a55df]" />
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            { id: "sauna", icon: ShowerHead, title: { fi: "Saunavuoro", en: "Sauna", sv: "Bastutid" }, time: "la 18.30–19.30" },
            { id: "laundry", icon: WashingMachine, title: { fi: "Pesutupa", en: "Laundry room", sv: "Tvättstuga" }, time: "su 10.00–12.00" },
            { id: "club", icon: Users, title: { fi: "Kerhohuone", en: "Common room", sv: "Klubbrum" }, time: "pe 17.00–21.00" },
          ].map((item) => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => { setBooked(item.id); show(text({ fi: "Demo-varaus vahvistettu", en: "Demo booking confirmed", sv: "Demobokningen bekräftades" })); }} className={`rounded-2xl border p-5 text-left transition ${booked === item.id ? "border-[#0a55df] bg-[#eaf3ff]" : "border-[#dbe4ec] hover:border-[#8aafd7]"}`}><Icon className="text-[#0a55df]" size={21} /><b className="mt-5 block">{text(item.title)}</b><span className="mt-2 block text-sm text-[#61758a]">{item.time}</span>{booked === item.id && <span className="mt-4 flex items-center gap-2 text-sm font-black text-[#08705b]"><Check size={16} />{text({ fi: "Varattu", en: "Booked", sv: "Bokad" })}</span>}</button>;
          })}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button onClick={() => show(text({ fi: "Autopaikkajono avattu", en: "Parking queue opened", sv: "Bilplatskön öppnades" }))} className="flex items-center justify-between rounded-2xl bg-[#f0f5f9] p-5 text-left font-black"><span className="flex items-center gap-3"><Car className="text-[#0a55df]" />{text({ fi: "Autopaikka- ja EV-jono", en: "Parking and EV queue", sv: "Bilplats- och elbilskö" })}</span><ChevronRight /></button>
          <button onClick={() => show(text({ fi: "Omat yhteystiedot avattu", en: "Contacts opened", sv: "Kontakter öppnade" }))} className="flex items-center justify-between rounded-2xl bg-[#f0f5f9] p-5 text-left font-black"><span className="flex items-center gap-3"><MessageSquare className="text-[#0a55df]" />{text({ fi: "Omat yhteyshenkilöt", en: "My contacts", sv: "Mina kontaktpersoner" })}</span><ChevronRight /></button>
        </div>
      </section>

      <section className="mt-5 grid gap-5 sm:grid-cols-3">
        {[{ icon: FileText, label: { fi: "Asiakirjat", en: "Documents", sv: "Dokument" }, value: "4" }, { icon: Zap, label: { fi: "Sähkösopimus", en: "Electricity contract", sv: "Elavtal" }, value: text({ fi: "Oma sopimus", en: "Own contract", sv: "Eget avtal" }) }, { icon: Home, label: { fi: "Vuokrasopimus", en: "Lease", sv: "Hyresavtal" }, value: text({ fi: "Voimassa", en: "Active", sv: "Gäller" }) }].map((item) => { const Icon = item.icon; return <button key={item.label.fi} onClick={() => show(text({ fi: "Dokumentti avattu demo-näkymässä", en: "Document opened in the demo", sv: "Dokumentet öppnades i demon" }))} className="flex items-center gap-4 rounded-2xl border border-[#dbe4ec] bg-white p-5 text-left"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#e7f1ff] text-[#0a55df]"><Icon size={19} /></span><span><b className="block">{text(item.label)}</b><small className="mt-1 block text-[#65798d]">{item.value}</small></span><Download className="ml-auto text-[#74899d]" size={18} /></button>; })}
      </section>

      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#eef4f8] p-5 text-sm leading-6 text-[#5f7488]"><Sparkles className="mt-0.5 shrink-0 text-[#0a55df]" size={18} /><p>{text({ fi: "Oma koti on konseptin yhtenäinen asiakasnäkymä. Se kokoaa eri taustajärjestelmien tiedot, mutta ei korvaa niiden sopimus-, laskutus- tai huoltoprosesseja.", en: "My home is the concept's unified customer view. It brings together data from existing systems without replacing lease, billing or maintenance processes.", sv: "Mitt hem är konceptets gemensamma kundvy. Den samlar information från befintliga system utan att ersätta avtals-, fakturerings- eller serviceprocesserna." })}</p></div>
    </main>
  );
}

