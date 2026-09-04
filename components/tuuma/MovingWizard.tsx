"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Home,
  KeyRound,
  MapPin,
  PackageCheck,
  Recycle,
  ShieldCheck,
  Sparkles,
  Truck,
  Upload,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "./LanguageProvider";

type Mode = "in" | "out";

export function MovingWizard() {
  const { text } = useLanguage();
  const [mode, setMode] = useState<Mode>("in");
  const [checked, setChecked] = useState<string[]>([]);
  const [photo, setPhoto] = useState("");
  const [keyTime, setKeyTime] = useState("1.10. · 12.30");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tuuma-moving-demo") || "{}");
    queueMicrotask(() => {
      if (stored.mode === "in" || stored.mode === "out") setMode(stored.mode);
      if (Array.isArray(stored.checked)) setChecked(stored.checked);
    });
  }, []);

  const tasks = useMemo(() => mode === "in" ? [
    { id: "keys", icon: KeyRound, title: text({ fi: "Varaa avainten nouto", en: "Book key collection", sv: "Boka hämtning av nycklar" }), detail: text({ fi: "Valitse sinulle sopiva aika.", en: "Choose a convenient time.", sv: "Välj en tid som passar." }) },
    { id: "inspection", icon: Camera, title: text({ fi: "Tee alkutarkastus", en: "Complete the initial inspection", sv: "Gör inflyttningskontrollen" }), detail: text({ fi: "Kuvaa mahdolliset valmiit jäljet 7 päivän sisällä.", en: "Record existing marks within seven days.", sv: "Dokumentera befintliga märken inom sju dagar." }) },
    { id: "address", icon: MapPin, title: text({ fi: "Tee osoitteenmuutos", en: "Change your address", sv: "Gör adressändring" }), detail: text({ fi: "Muista Digi- ja väestötietovirasto sekä Posti.", en: "Remember the authorities and postal service.", sv: "Kom ihåg myndigheterna och posten." }) },
    { id: "home", icon: Home, title: text({ fi: "Tutustu talon käytäntöihin", en: "Learn the building routines", sv: "Bekanta dig med husets rutiner" }), detail: text({ fi: "Jätehuolto, sauna, autopaikat ja turvallisuus.", en: "Waste, sauna, parking and safety.", sv: "Avfall, bastu, parkering och säkerhet." }) },
  ] : [
    { id: "notice", icon: ClipboardCheck, title: text({ fi: "Tarkista irtisanominen", en: "Check your notice", sv: "Kontrollera uppsägningen" }), detail: text({ fi: "Näet päättymispäivän ja sopimusehdot.", en: "See the end date and terms.", sv: "Se slutdatum och villkor." }) },
    { id: "clean", icon: Sparkles, title: text({ fi: "Tee muuttosiivous", en: "Complete move-out cleaning", sv: "Gör flyttstädningen" }), detail: text({ fi: "Huonekohtainen tarkistuslista auttaa.", en: "Use the room-by-room checklist.", sv: "Använd checklistan rum för rum." }) },
    { id: "photos", icon: Camera, title: text({ fi: "Dokumentoi asunnon kunto", en: "Document the home's condition", sv: "Dokumentera bostadens skick" }), detail: text({ fi: "Lisää kuvat ennen avainten palautusta.", en: "Add photos before returning keys.", sv: "Lägg till bilder före nyckelreturen." }) },
    { id: "return", icon: KeyRound, title: text({ fi: "Palauta kaikki avaimet", en: "Return all keys", sv: "Lämna tillbaka alla nycklar" }), detail: text({ fi: "Varaa palautusaika ja tarkista määrä.", en: "Book a return time and confirm the count.", sv: "Boka en tid och kontrollera antalet." }) },
  ], [mode, text]);

  const done = tasks.filter((task) => checked.includes(`${mode}-${task.id}`)).length;
  const percent = Math.round((done / tasks.length) * 100);

  function toggle(id: string) {
    const key = `${mode}-${id}`;
    const next = checked.includes(key) ? checked.filter((item) => item !== key) : [...checked, key];
    setChecked(next);
    localStorage.setItem("tuuma-moving-demo", JSON.stringify({ mode, checked: next }));
  }

  function changeMode(next: Mode) {
    setMode(next);
    localStorage.setItem("tuuma-moving-demo", JSON.stringify({ mode: next, checked }));
  }

  function addPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file.name);
      setNotice(text({ fi: "Kuva lisättiin tarkastukseen (demo)", en: "Photo added to the inspection (demo)", sv: "Bilden lades till i kontrollen (demo)" }));
    }
  }

  return (
    <main id="main" className="shell py-10 sm:py-16">
      <div className="grid items-end gap-7 lg:grid-cols-[1fr_auto]">
        <div className="max-w-4xl">
          <span className="rounded-full bg-[#e5efff] px-3 py-2 text-[11px] font-black uppercase tracking-[.13em] text-[#0a55df]">Moving companion · Demo</span>
          <h1 className="display mt-5 text-5xl sm:text-7xl">{text({ fi: "Muutto ilman muistettavien asioiden kaaosta", en: "Move without the checklist chaos", sv: "Flytta utan kaoset av saker att minnas" })}</h1>
        </div>
        <div className="flex rounded-full bg-white p-1 shadow-sm" role="group" aria-label={text({ fi: "Muuton tyyppi", en: "Move type", sv: "Typ av flytt" })}>
          <button onClick={() => changeMode("in")} className={`min-h-12 rounded-full px-5 text-sm font-black ${mode === "in" ? "bg-[#0a55df] text-white" : "text-[#5f7489]"}`}>{text({ fi: "Muutan sisään", en: "Moving in", sv: "Jag flyttar in" })}</button>
          <button onClick={() => changeMode("out")} className={`min-h-12 rounded-full px-5 text-sm font-black ${mode === "out" ? "bg-[#0a55df] text-white" : "text-[#5f7489]"}`}>{text({ fi: "Muutan pois", en: "Moving out", sv: "Jag flyttar ut" })}</button>
        </div>
      </div>

      {notice && <div className="mt-6 flex items-center gap-2 rounded-2xl bg-[#e6f6ef] p-4 text-sm font-black text-[#08705b]" role="status"><CheckCircle2 size={18} />{notice}</div>}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.12fr_.88fr]">
        <section className="rounded-[32px] bg-white p-6 sm:p-9">
          <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">{mode === "in" ? text({ fi: "Sisäänmuutto", en: "Moving in", sv: "Inflyttning" }) : text({ fi: "Poismuutto", en: "Moving out", sv: "Utflyttning" })}</p><h2 className="mt-3 text-2xl font-black">{done}/{tasks.length} {text({ fi: "tehtävää valmiina", en: "tasks complete", sv: "uppgifter klara" })}</h2></div><strong className="text-2xl text-[#0a55df]">{percent} %</strong></div>
          <Progress value={percent} className="mt-5" />
          <div className="mt-8 grid gap-3">
            {tasks.map((task) => {
              const Icon = task.icon;
              const selected = checked.includes(`${mode}-${task.id}`);
              return <button key={task.id} onClick={() => toggle(task.id)} className={`flex min-h-24 items-start gap-4 rounded-2xl border p-5 text-left transition ${selected ? "border-[#8bcbb8] bg-[#e8f7f1]" : "border-[#d9e3eb] hover:border-[#86add6]"}`}><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${selected ? "bg-[#08705b] text-white" : "bg-[#e6f1ff] text-[#0a55df]"}`}>{selected ? <Check size={20} /> : <Icon size={20} />}</span><span><b className="block">{task.title}</b><small className="mt-2 block leading-5 text-[#60758a]">{task.detail}</small></span><span className={`ml-auto mt-2 h-5 w-5 shrink-0 rounded-full border-2 ${selected ? "border-[#08705b] bg-[#08705b]" : "border-[#a8b8c5]"}`} /></button>;
            })}
          </div>
          {percent === 100 && <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#0d2e50] p-5 text-white"><PackageCheck className="mt-0.5 shrink-0 text-[#79baf7]" /><p><b>{text({ fi: "Kaikki valmista!", en: "All set!", sv: "Allt klart!" })}</b><span className="mt-1 block text-sm leading-6 text-[#c5d8e8]">{text({ fi: "Tarkistuslista tallentui tälle laitteelle.", en: "The checklist is saved on this device.", sv: "Checklistan har sparats på den här enheten." })}</span></p></div>}
        </section>

        <aside className="grid content-start gap-5">
          <article className="rounded-[28px] bg-[#dfeeff] p-6 sm:p-8">
            <CalendarDays className="text-[#0a55df]" />
            <p className="eyebrow mt-7">{mode === "in" ? text({ fi: "Avainten nouto", en: "Key collection", sv: "Hämtning av nycklar" }) : text({ fi: "Avainten palautus", en: "Key return", sv: "Återlämning av nycklar" })}</p>
            <select value={keyTime} onChange={(event) => setKeyTime(event.target.value)} className="mt-4 h-12 w-full rounded-xl border border-[#cbd9e5] bg-white px-3 font-bold"><option>1.10. · 12.30</option><option>1.10. · 15.00</option><option>2.10. · 09.00</option></select>
            <button onClick={() => setNotice(text({ fi: "Avainaika varattiin demo-näkymässä", en: "Key appointment booked in the demo", sv: "Nyckeltiden bokades i demon" }))} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0a55df] px-5 text-sm font-black text-white">{text({ fi: "Varaa aika", en: "Book time", sv: "Boka tid" })}<ArrowRight size={16} /></button>
          </article>

          <label className="cursor-pointer rounded-[28px] bg-white p-6 sm:p-8">
            <Camera className="text-[#0a55df]" />
            <h2 className="mt-6 text-xl font-black">{mode === "in" ? text({ fi: "Alkutarkastuksen kuvat", en: "Initial inspection photos", sv: "Bilder från inflyttningskontrollen" }) : text({ fi: "Poismuuttokuvat", en: "Move-out photos", sv: "Bilder vid utflyttning" })}</h2>
            <p className="mt-3 text-sm leading-6 text-[#60758a]">{photo || text({ fi: "Lisää kuva puhelimesta. Tuotannossa kuva liittyy tarkastukseen ja saa aikaleiman.", en: "Add a phone photo. In production, it is timestamped and attached to the inspection.", sv: "Lägg till en bild från telefonen. I produktion tidsstämplas den och kopplas till kontrollen." })}</p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#cedae4] px-4 py-3 text-sm font-black"><Upload size={16} />{text({ fi: "Valitse kuva", en: "Choose photo", sv: "Välj bild" })}</span>
            <input type="file" accept="image/*" className="sr-only" onChange={addPhoto} />
          </label>

          <article className="rounded-[28px] bg-[#0d2e50] p-6 text-white sm:p-8">
            <ShieldCheck className="text-[#77b8f6]" />
            <h2 className="mt-6 text-xl font-black">{text({ fi: "Oikea tieto oikeaan aikaan", en: "The right information at the right time", sv: "Rätt information i rätt tid" })}</h2>
            <p className="mt-3 text-sm leading-6 text-[#c5d8e8]">{text({ fi: "Ohjeet vaihtuvat muuton vaiheen mukaan. Asiakaspalvelun ei tarvitse lähettää samoja muistilistoja käsin.", en: "Guidance adapts to the move stage, so customer service does not have to send the same checklists manually.", sv: "Anvisningarna anpassas till flyttskedet, så kundtjänsten behöver inte skicka samma checklistor manuellt." })}</p>
          </article>
        </aside>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Action icon={ExternalLink} title={text({ fi: "Osoitteenmuutos", en: "Address change", sv: "Adressändring" })} detail={text({ fi: "Virallinen palvelu avautuisi uuteen välilehteen.", en: "The official service would open in a new tab.", sv: "Den officiella tjänsten skulle öppnas i en ny flik." })} />
        <Action icon={Recycle} title={text({ fi: "Kierrätys ja lajittelu", en: "Recycling", sv: "Återvinning" })} detail={text({ fi: "Talokohtaiset jätepisteet ja ohjeet.", en: "Building-specific collection points and guidance.", sv: "Husspecifika insamlingsplatser och anvisningar." })} />
        <Action icon={Truck} title={text({ fi: "Muuttopäivän pysäköinti", en: "Moving-day parking", sv: "Parkering på flyttdagen" })} detail={text({ fi: "Varaa lyhytaikainen paikka oven läheltä.", en: "Reserve a short-term space near the entrance.", sv: "Reservera en korttidsplats nära ingången." })} />
      </section>
    </main>
  );
}

function Action({ icon: Icon, title, detail }: { icon: typeof ExternalLink; title: string; detail: string }) {
  return <button className="flex items-start gap-4 rounded-2xl border border-[#dae3eb] bg-white p-5 text-left"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#e6f1ff] text-[#0a55df]"><Icon size={19} /></span><span><b className="block">{title}</b><small className="mt-2 block leading-5 text-[#60758a]">{detail}</small></span><ArrowRight className="ml-auto shrink-0 text-[#6f8497]" size={17} /></button>;
}
