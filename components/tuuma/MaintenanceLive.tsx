"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Camera,
  Check,
  CheckCircle2,
  Clock3,
  Droplets,
  KeyRound,
  Send,
  Sparkles,
  Star,
  Upload,
  Wrench,
  Zap,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "./LanguageProvider";

const issues = [
  { id: "water", icon: Droplets, label: { fi: "Vesi tai viemäri", en: "Water or drain", sv: "Vatten eller avlopp" }, urgent: true },
  { id: "electric", icon: Zap, label: { fi: "Sähkö", en: "Electricity", sv: "El" }, urgent: true },
  { id: "fixture", icon: Wrench, label: { fi: "Kaluste tai pinta", en: "Fixture or surface", sv: "Inredning eller yta" }, urgent: false },
  { id: "other", icon: Sparkles, label: { fi: "Muu asia", en: "Other issue", sv: "Annat ärende" }, urgent: false },
] as const;

export function MaintenanceLive() {
  const searchParams = useSearchParams();
  const { text } = useLanguage();
  const startsUrgent = searchParams.get("urgent") === "1";
  const [step, setStep] = useState(startsUrgent ? 1 : 0);
  const [issue, setIssue] = useState<string>(startsUrgent ? "water" : "");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [masterKey, setMasterKey] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketStep, setTicketStep] = useState(1);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [rating, setRating] = useState(0);

  const selected = issues.find((item) => item.id === issue);
  const urgent = Boolean(selected?.urgent);

  function addFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setFileName(file.name);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const payload = { ticketId: "HUOLTO-1042", issue, description, masterKey, createdAt: new Date().toISOString() };
    localStorage.setItem("tuuma-maintenance-demo", JSON.stringify(payload));
    setSubmitted(true);
  }

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setMessages((current) => [...current, message.trim()]);
    setMessage("");
  }

  if (submitted) {
    const status = [
      text({ fi: "Pyyntö vastaanotettu", en: "Request received", sv: "Anmälan mottagen" }),
      text({ fi: "Kiireellisyys arvioitu", en: "Urgency assessed", sv: "Brådskan bedömd" }),
      text({ fi: "Käynti sovittu", en: "Visit scheduled", sv: "Besök bokat" }),
      text({ fi: "Työ valmis", en: "Work completed", sv: "Arbetet klart" }),
    ];
    return (
      <main id="main" className="shell py-10 sm:py-16">
        <div className="max-w-3xl">
          <span className="rounded-full bg-[#e5f6ee] px-3 py-2 text-[11px] font-black uppercase tracking-[.13em] text-[#08705b]">HUOLTO-1042 · Live demo</span>
          <h1 className="display mt-5 text-5xl sm:text-7xl">{text({ fi: "Pyyntö on matkalla", en: "Your request is moving", sv: "Din anmälan är på väg" })}</h1>
          <p className="mt-5 text-lg leading-8 text-[#5f7489]">{text({ fi: "Näet samasta paikasta käsittelijän viestit, arvioidun käyntiajan ja pyynnön etenemisen.", en: "See messages, the estimated visit time and progress in one place.", sv: "Se meddelanden, uppskattad besökstid och ärendets status på samma ställe." })}</p>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <section className="rounded-[30px] bg-white p-6 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><p className="eyebrow">{text({ fi: "Tämänhetkinen tila", en: "Current status", sv: "Nuvarande status" })}</p><h2 className="mt-3 text-2xl font-black">{status[ticketStep]}</h2></div>
              <span className={`rounded-full px-4 py-2 text-sm font-black ${urgent ? "bg-[#fff0ed] text-[#a1392d]" : "bg-[#e6f6ef] text-[#08705b]"}`}>{urgent ? text({ fi: "Kiireellinen", en: "Urgent", sv: "Brådskande" }) : text({ fi: "Normaali", en: "Standard", sv: "Normal" })}</span>
            </div>

            <div className="mt-8 grid gap-0">
              {status.map((label, index) => (
                <div key={label} className="grid grid-cols-[34px_1fr] gap-4">
                  <div className="flex flex-col items-center"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${index <= ticketStep ? "bg-[#0a55df] text-white" : "bg-[#e4ebf1] text-[#708397]"}`}>{index < ticketStep ? <Check size={17} /> : index + 1}</span>{index < status.length - 1 && <span className={`h-12 w-0.5 ${index < ticketStep ? "bg-[#0a55df]" : "bg-[#dce5ed]"}`} />}</div>
                  <div className="pt-1"><b>{label}</b>{index === ticketStep && <small className="mt-1 block text-[#60758a]">{text({ fi: "Päivitetty 4.9. klo 10.15", en: "Updated 4 Sep at 10:15", sv: "Uppdaterad 4.9 kl. 10.15" })}</small>}</div>
                </div>
              ))}
            </div>

            <button disabled={ticketStep === 3} onClick={() => setTicketStep((value) => Math.min(3, value + 1))} className="mt-5 rounded-full border border-[#cfdbe5] px-5 py-3 text-sm font-black disabled:opacity-40">{text({ fi: "Demo: siirrä seuraavaan vaiheeseen", en: "Demo: advance status", sv: "Demo: gå till nästa steg" })}</button>
          </section>

          <aside className="grid gap-5">
            <article className="rounded-[28px] bg-[#0d2e50] p-6 text-white">
              <CalendarClock className="text-[#72b5f5]" />
              <p className="eyebrow mt-7 !text-[#91b8df]">{text({ fi: "Arvioitu käynti", en: "Estimated visit", sv: "Uppskattat besök" })}</p>
              <p className="mt-3 text-2xl font-black">{urgent ? text({ fi: "Tänään 12–14", en: "Today 12–14", sv: "I dag 12–14" }) : text({ fi: "Huomenna 10–12", en: "Tomorrow 10–12", sv: "I morgon 10–12" })}</p>
              <p className="mt-4 text-sm leading-6 text-[#c5d7e8]">{masterKey ? text({ fi: "Huolto saa tulla yleisavaimella.", en: "Maintenance may enter with a master key.", sv: "Service får komma in med huvudnyckel." }) : text({ fi: "Asukas on paikalla avaamassa oven.", en: "Resident will open the door.", sv: "Den boende öppnar dörren." })}</p>
            </article>
            <article className="rounded-[28px] bg-[#dfeeff] p-6">
              <h2 className="font-black">{text({ fi: "Viesti huollolta", en: "Message from maintenance", sv: "Meddelande från service" })}</h2>
              <p className="mt-3 text-sm leading-6 text-[#4f6880]">{text({ fi: "Kiitos kuvasta. Varaosa on mukana, joten vika voidaan todennäköisesti korjata yhdellä käynnillä.", en: "Thanks for the photo. We will bring the part and should be able to fix this in one visit.", sv: "Tack för bilden. Reservdelen tas med, så felet kan sannolikt åtgärdas under ett besök." })}</p>
              {messages.map((item) => <p key={item} className="mt-3 rounded-2xl bg-white p-3 text-sm">{item}</p>)}
              <form onSubmit={sendMessage} className="mt-4 flex gap-2"><input value={message} onChange={(event) => setMessage(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-[#cddae5] px-3" placeholder={text({ fi: "Kirjoita viesti", en: "Write a message", sv: "Skriv ett meddelande" })} aria-label={text({ fi: "Viesti huollolle", en: "Message to maintenance", sv: "Meddelande till service" })} /><button className="grid h-11 w-11 place-items-center rounded-xl bg-[#0a55df] text-white" aria-label={text({ fi: "Lähetä", en: "Send", sv: "Skicka" })}><Send size={17} /></button></form>
            </article>
          </aside>
        </div>

        {ticketStep === 3 && <section className="mt-6 rounded-[28px] bg-white p-6 sm:p-8"><h2 className="text-xl font-black">{text({ fi: "Miten onnistuimme?", en: "How did we do?", sv: "Hur lyckades vi?" })}</h2><div className="mt-5 flex gap-2" role="group" aria-label={text({ fi: "Arvio", en: "Rating", sv: "Betyg" })}>{[1,2,3,4,5].map((value) => <button key={value} onClick={() => setRating(value)} aria-label={`${value}/5`} className="grid h-11 w-11 place-items-center rounded-full bg-[#edf3f8]"><Star size={20} fill={value <= rating ? "#0a55df" : "none"} className={value <= rating ? "text-[#0a55df]" : "text-[#75899c]"} /></button>)}</div></section>}

        <Link href="/oma-koti" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#0a55df]"><ArrowLeft size={17} />{text({ fi: "Takaisin Oma koti -näkymään", en: "Back to My home", sv: "Tillbaka till Mitt hem" })}</Link>
      </main>
    );
  }

  return (
    <main id="main" className="shell py-10 sm:py-16">
      <div className="max-w-3xl">
        <span className="rounded-full bg-[#e5efff] px-3 py-2 text-[11px] font-black uppercase tracking-[.13em] text-[#0a55df]">Huolto Live · Demo</span>
        <h1 className="display mt-5 text-5xl sm:text-7xl">{text({ fi: "Kerro viasta. Me ohjaamme eteenpäin.", en: "Tell us what is wrong. We will guide you.", sv: "Berätta vad som är fel. Vi hjälper dig vidare." })}</h1>
        <p className="mt-5 text-lg leading-8 text-[#5e7489]">{text({ fi: "Kiireellisyys arvioidaan ennen lähetystä. Vuodoissa ja turvallisuusriskissä saat heti oikean toimintaohjeen.", en: "Urgency is assessed before submission. For leaks and safety risks, you get immediate guidance.", sv: "Brådskan bedöms före sändning. Vid läckage och säkerhetsrisker får du genast rätt anvisning." })}</p>
      </div>

      <form onSubmit={submit} className="mt-9 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
        <aside className="rounded-[30px] bg-[#dfeeff] p-6 sm:p-8">
          <div className="flex items-center justify-between"><span className="eyebrow">{text({ fi: "Vaihe", en: "Step", sv: "Steg" })} {step + 1} / 4</span><b className="text-sm text-[#0a55df]">{(step + 1) * 25} %</b></div>
          <Progress value={(step + 1) * 25} className="mt-4" />
          <div className="mt-8 grid gap-3">
            {[text({ fi: "Aihe", en: "Issue", sv: "Ärende" }), text({ fi: "Kuvaus ja media", en: "Details and media", sv: "Beskrivning och media" }), text({ fi: "Sisäänpääsy", en: "Access", sv: "Tillträde" }), text({ fi: "Tarkista", en: "Review", sv: "Granska" })].map((label, index) => <button type="button" key={label} onClick={() => index <= step && setStep(index)} className={`flex items-center gap-3 rounded-2xl p-4 text-left text-sm font-black ${index === step ? "bg-white text-[#0a55df]" : "text-[#516b83]"}`}><span className={`grid h-7 w-7 place-items-center rounded-full ${index < step ? "bg-[#0a55df] text-white" : "bg-white"}`}>{index < step ? <Check size={15} /> : index + 1}</span>{label}</button>)}
          </div>
        </aside>

        <section className="rounded-[30px] bg-white p-6 sm:p-9">
          {step === 0 && <><p className="eyebrow">{text({ fi: "Valitse lähin aihe", en: "Choose the closest issue", sv: "Välj det närmaste ärendet" })}</p><h2 className="display mt-3 text-4xl">{text({ fi: "Mitä asunnossa tapahtui?", en: "What happened in the home?", sv: "Vad har hänt i bostaden?" })}</h2><div className="mt-7 grid gap-3 sm:grid-cols-2">{issues.map((item) => { const Icon = item.icon; return <button type="button" key={item.id} onClick={() => { setIssue(item.id); setStep(1); }} className={`rounded-2xl border p-5 text-left transition hover:border-[#82ace0] ${issue === item.id ? "border-[#0a55df] bg-[#eaf3ff]" : "border-[#d7e2eb]"}`}><Icon className="text-[#0a55df]" /><b className="mt-5 block">{text(item.label)}</b>{item.urgent && <small className="mt-2 block text-[#9b3b2e]">{text({ fi: "Voi vaatia nopeaa toimintaa", en: "May require immediate action", sv: "Kan kräva snabba åtgärder" })}</small>}</button>; })}</div></>}

          {step === 1 && <><p className="eyebrow">{text({ fi: "Kuvaus ja media", en: "Details and media", sv: "Beskrivning och media" })}</p><h2 className="display mt-3 text-4xl">{text({ fi: "Näytä, mitä on tapahtunut", en: "Show us what happened", sv: "Visa vad som har hänt" })}</h2>{urgent && <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#fff0ed] p-5 text-sm leading-6 text-[#87382e]"><AlertTriangle className="mt-0.5 shrink-0" size={19} /><p><b>{text({ fi: "Rajoita vahinko ensin.", en: "Limit damage first.", sv: "Begränsa skadan först." })}</b> {text({ fi: "Sulje tarvittaessa vesihana tai katkaise virta vain, jos se on turvallista.", en: "Close the water tap or disconnect power only if it is safe.", sv: "Stäng vattenkranen eller bryt strömmen endast om det är säkert." })}</p></div>}<label className="mt-6 grid gap-2 text-sm font-black">{text({ fi: "Kuvaile tilanne", en: "Describe the situation", sv: "Beskriv situationen" })}<textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-36 rounded-2xl border border-[#ccd9e4] p-4 text-base font-normal" placeholder={text({ fi: "Missä vika on ja milloin huomasit sen?", en: "Where is the issue and when did you notice it?", sv: "Var finns felet och när märkte du det?" })} /></label><label className="mt-4 flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#aebfce] p-5"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e6f1ff] text-[#0a55df]"><Camera size={20} /></span><span><b className="block">{fileName || text({ fi: "Lisää kuva tai video", en: "Add a photo or video", sv: "Lägg till bild eller video" })}</b><small className="mt-1 block text-[#687c8f]">{text({ fi: "Demo ei tallenna tiedostoa", en: "The demo does not store the file", sv: "Demon sparar inte filen" })}</small></span><Upload className="ml-auto text-[#6f8497]" size={19} /><input type="file" accept="image/*,video/*" className="sr-only" onChange={addFile} /></label></>}

          {step === 2 && <><p className="eyebrow">{text({ fi: "Sisäänpääsy", en: "Access", sv: "Tillträde" })}</p><h2 className="display mt-3 text-4xl">{text({ fi: "Miten huolto pääsee sisään?", en: "How may maintenance enter?", sv: "Hur kommer service in?" })}</h2><button type="button" onClick={() => setMasterKey((value) => !value)} className={`mt-7 flex w-full items-start gap-4 rounded-2xl border p-5 text-left ${masterKey ? "border-[#0a55df] bg-[#eaf3ff]" : "border-[#d5e0e9]"}`}><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border ${masterKey ? "border-[#0a55df] bg-[#0a55df] text-white" : "border-[#9eafbe]"}`}>{masterKey && <Check size={15} />}</span><span><b className="flex items-center gap-2"><KeyRound size={18} />{text({ fi: "Huolto saa tulla yleisavaimella", en: "Maintenance may use a master key", sv: "Service får använda huvudnyckel" })}</b><small className="mt-2 block leading-5 text-[#62778b]">{text({ fi: "Suostumuksen voi perua ennen käyntiä. Käynnistä jää lokimerkintä.", en: "You can withdraw consent before the visit. The entry is logged.", sv: "Samtycket kan återtas före besöket. Inträdet loggas." })}</small></span></button><button type="button" onClick={() => setMasterKey(false)} className={`mt-3 flex w-full items-center gap-4 rounded-2xl border p-5 text-left font-black ${!masterKey ? "border-[#0a55df] bg-[#eaf3ff]" : "border-[#d5e0e9]"}`}><Clock3 className="text-[#0a55df]" />{text({ fi: "Sovin käyntiajan ja olen paikalla", en: "I will agree a time and be present", sv: "Jag avtalar en tid och är på plats" })}</button></>}

          {step === 3 && <><p className="eyebrow">{text({ fi: "Tarkista", en: "Review", sv: "Granska" })}</p><h2 className="display mt-3 text-4xl">{text({ fi: "Valmis lähetettäväksi", en: "Ready to submit", sv: "Klar att skickas" })}</h2><div className="mt-7 grid gap-3">{[[text({ fi: "Aihe", en: "Issue", sv: "Ärende" }), selected ? text(selected.label) : "—"], [text({ fi: "Kiireellisyys", en: "Urgency", sv: "Brådska" }), urgent ? text({ fi: "Kiireellinen", en: "Urgent", sv: "Brådskande" }) : text({ fi: "Normaali", en: "Standard", sv: "Normal" })], [text({ fi: "Media", en: "Media", sv: "Media" }), fileName || text({ fi: "Ei liitettä", en: "No attachment", sv: "Ingen bilaga" })], [text({ fi: "Sisäänpääsy", en: "Access", sv: "Tillträde" }), masterKey ? text({ fi: "Yleisavain sallittu", en: "Master key allowed", sv: "Huvudnyckel tillåten" }) : text({ fi: "Asukas paikalla", en: "Resident present", sv: "Boende på plats" })]].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 rounded-2xl bg-[#f0f5f9] p-4"><span className="text-sm text-[#61758a]">{label}</span><b className="text-right text-sm">{value}</b></div>)}</div><div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#e7f6ef] p-4 text-sm leading-6 text-[#256a58]"><CheckCircle2 className="mt-0.5 shrink-0" size={19} />{text({ fi: "Saat tunnuksen ja voit seurata pyyntöä ilman uutta yhteydenottoa.", en: "You receive a reference and can follow progress without contacting support again.", sv: "Du får ett ärendenummer och kan följa status utan att kontakta kundtjänsten på nytt." })}</div></>}

          <div className="mt-8 flex items-center justify-between gap-3"><button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-black text-[#536c83] disabled:opacity-30"><ArrowLeft size={17} />{text({ fi: "Takaisin", en: "Back", sv: "Tillbaka" })}</button>{step < 3 ? <button type="button" disabled={step === 0 && !issue || step === 1 && !description.trim()} onClick={() => setStep((value) => Math.min(3, value + 1))} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0a55df] px-6 text-sm font-black text-white disabled:opacity-40">{text({ fi: "Jatka", en: "Continue", sv: "Fortsätt" })}<ArrowRight size={17} /></button> : <button type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0a55df] px-6 text-sm font-black text-white">{text({ fi: "Lähetä pyyntö", en: "Submit request", sv: "Skicka anmälan" })}<ArrowRight size={17} /></button>}</div>
        </section>
      </form>
    </main>
  );
}
