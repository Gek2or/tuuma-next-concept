"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarClock,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage, type Locale } from "./LanguageProvider";

type Answer = {
  questions: Record<Locale, string>;
  keywords: string[];
  body: Record<Locale, string>;
  cta: Record<Locale, string>;
  href: string;
  source: Record<Locale, string>;
  urgent?: boolean;
};

const answers: Answer[] = [
  {
    questions: {
      fi: "Pesukone vuotaa",
      en: "My washing machine is leaking",
      sv: "Tvättmaskinen läcker",
    },
    keywords: ["vuot", "vesi", "leak", "water", "läck", "vatten"],
    body: {
      fi: "Sulje vesihana heti ja kuivaa näkyvä vesi. Jos vuoto jatkuu tai vettä pääsee rakenteisiin, soita päivystykseen. Muussa tapauksessa tee kiireellinen huoltopyyntö.",
      en: "Close the water tap immediately and dry visible water. If the leak continues or water reaches the structures, call emergency maintenance. Otherwise submit an urgent request.",
      sv: "Stäng vattenkranen genast och torka upp synligt vatten. Ring jouren om läckaget fortsätter eller vatten når konstruktionerna. Gör annars en brådskande serviceanmälan.",
    },
    cta: {
      fi: "Tee kiireellinen huoltopyyntö",
      en: "Submit urgent request",
      sv: "Gör en brådskande anmälan",
    },
    href: "/huolto?urgent=1",
    source: {
      fi: "Vesivuoto ja vahingon rajaaminen · Asukasohje 4.2",
      en: "Water leak and damage control · Resident guide 4.2",
      sv: "Vattenläcka och skadebegränsning · Boendeguide 4.2",
    },
    urgent: true,
  },
  {
    questions: {
      fi: "Kadotin avaimeni",
      en: "I lost my key",
      sv: "Jag har tappat min nyckel",
    },
    keywords: ["avain", "avaim", "key", "nyckel"],
    body: {
      fi: "Jos jäit oven ulkopuolelle, ota yhteys ovenavauspäivystykseen. Henkilöllisyys tarkistetaan ennen avausta. Kadonneesta avaimesta tehdään lisäksi ilmoitus Oma koti -palvelussa.",
      en: "If you are locked out, contact the door-opening service. Your identity will be checked. Also report a lost key in My home.",
      sv: "Om du är utelåst, kontakta dörröppningsjouren. Din identitet kontrolleras. Anmäl också den borttappade nyckeln i Mitt hem.",
    },
    cta: { fi: "Avaa avainapu", en: "Open key help", sv: "Öppna nyckelhjälp" },
    href: "/asukkaille",
    source: {
      fi: "Avaimet ja ovenavaus · Asukasohje 2.1",
      en: "Keys and door opening · Resident guide 2.1",
      sv: "Nycklar och dörröppning · Boendeguide 2.1",
    },
    urgent: true,
  },
  {
    questions: {
      fi: "Milloin vuokra pitää maksaa?",
      en: "When is rent due?",
      sv: "När ska hyran betalas?",
    },
    keywords: ["vuokra", "maks", "rent", "pay", "hyra", "betal"],
    body: {
      fi: "Eräpäivä ja oikea viitenumero näkyvät Oma koti -palvelun maksutiedoissa sekä vuokrasopimuksessa. Maksuneuvontaan voi siirtyä samasta näkymästä.",
      en: "The due date and reference number are shown in My home and in your lease. You can also reach payment support from the same view.",
      sv: "Förfallodagen och referensnumret finns i Mitt hem och i ditt hyresavtal. Därifrån når du också betalningsrådgivningen.",
    },
    cta: { fi: "Avaa maksut", en: "Open payments", sv: "Öppna betalningar" },
    href: "/oma-koti#payments",
    source: {
      fi: "Vuokra ja maksaminen · Asukasohje 1.3",
      en: "Rent and payments · Resident guide 1.3",
      sv: "Hyra och betalningar · Boendeguide 1.3",
    },
  },
  {
    questions: {
      fi: "Miten teen huoltopyynnön?",
      en: "How do I submit a maintenance request?",
      sv: "Hur gör jag en serviceanmälan?",
    },
    keywords: ["huolto", "vika", "maintenance", "repair", "service", "fel"],
    body: {
      fi: "Kuvaile vika, lisää kuva ja kerro, saako huolto tulla yleisavaimella. Huolto Live näyttää etenemisen ja arvioidun käyntiajan.",
      en: "Describe the issue, add a photo and say whether maintenance may enter with a master key. Maintenance Live shows progress and the estimated visit time.",
      sv: "Beskriv felet, lägg till en bild och ange om service får komma in med huvudnyckel. Service Live visar status och uppskattad besökstid.",
    },
    cta: { fi: "Aloita huoltopyyntö", en: "Start request", sv: "Starta anmälan" },
    href: "/huolto",
    source: {
      fi: "Huoltopyynnön tekeminen · Asukasohje 4.1",
      en: "Submitting a request · Resident guide 4.1",
      sv: "Göra en serviceanmälan · Boendeguide 4.1",
    },
  },
  {
    questions: {
      fi: "Miten muutan sisään?",
      en: "How do I move in?",
      sv: "Hur flyttar jag in?",
    },
    keywords: ["muutto", "sisään", "move", "flytt", "flytta"],
    body: {
      fi: "Muuttoapuri kokoaa avainten noudon, alkutarkastuksen, osoitteenmuutoksen ja talon käytännöt yhdeksi tarkistuslistaksi.",
      en: "The moving assistant combines key collection, initial inspection, address change and building guidance into one checklist.",
      sv: "Flyttguiden samlar nyckelhämtning, inflyttningskontroll, adressändring och husets anvisningar i en checklista.",
    },
    cta: { fi: "Avaa muuttoapuri", en: "Open moving guide", sv: "Öppna flyttguiden" },
    href: "/muutto",
    source: {
      fi: "Muutto kotiin · Asukasohje 3.1",
      en: "Moving into your home · Resident guide 3.1",
      sv: "Inflyttning · Boendeguide 3.1",
    },
  },
];

export function AssistantV2() {
  const pathname = usePathname();
  const { locale, text } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Answer | "unknown">();
  const [sourceOpen, setSourceOpen] = useState(false);

  const labels = useMemo(
    () => ({
      button: text({ fi: "Kysy Tuumalta", en: "Ask Tuuma", sv: "Fråga Tuuma" }),
      eyebrow: text({ fi: "Ohjeisiin rajattu apuri", en: "Guidance-only assistant", sv: "Assistent baserad på anvisningar" }),
      intro: text({
        fi: "Vastaukset perustuvat Tuuman hyväksyttyihin ohjeisiin. Demo ei käytä avointa internetiä.",
        en: "Answers are based on Tuuma-approved guidance. This demo does not use the open internet.",
        sv: "Svaren baseras på anvisningar godkända av Tuuma. Demon använder inte öppet internet.",
      }),
      placeholder: text({ fi: "Kirjoita kysymyksesi…", en: "Type your question…", sv: "Skriv din fråga…" }),
      source: text({ fi: "Näytä lähde", en: "Show source", sv: "Visa källa" }),
      updated: text({ fi: "Ohje tarkistettu 28.8.2026 · demo", en: "Guidance reviewed 28 Aug 2026 · demo", sv: "Anvisningen granskad 28.8.2026 · demo" }),
      unknown: text({
        fi: "En löytänyt tähän varmaa vastausta hyväksytyistä ohjeista. En arvaa — voin ohjata kysymyksen asiakaspalvelulle.",
        en: "I could not find a reliable answer in the approved guidance. I will not guess — I can direct this to customer service.",
        sv: "Jag hittade inget säkert svar i de godkända anvisningarna. Jag gissar inte — jag kan hänvisa frågan till kundtjänsten.",
      }),
    }),
    [text],
  );

  function submit(event: FormEvent) {
    event.preventDefault();
    const normalized = query.trim().toLowerCase();
    const match = answers.find((item) =>
      item.keywords.some((keyword) => normalized.includes(keyword)),
    );
    setSelected(match ?? "unknown");
    setSourceOpen(false);
  }

  function choose(item: Answer) {
    setSelected(item);
    setQuery(item.questions[locale]);
    setSourceOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed right-3 z-40 flex min-h-12 items-center gap-2 rounded-full bg-[#3d4785] px-4 py-3 text-sm font-black text-white shadow-[0_8px_24px_rgba(34,38,75,.2)] sm:right-6 sm:px-5 ${pathname.startsWith("/kohteet") ? "bottom-20 sm:bottom-20" : "bottom-4 sm:bottom-6"}`}
        aria-label={labels.button}
      >
        <Sparkles size={18} />
        {labels.button}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-auto rounded-[28px] p-5 sm:max-w-xl sm:p-8">
          <DialogHeader>
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f1ff] text-[#3d4785]">
              <ShieldCheck size={21} />
            </div>
            <p className="eyebrow text-left">{labels.eyebrow}</p>
            <DialogTitle className="display text-left text-4xl">{labels.button}</DialogTitle>
            <DialogDescription className="text-left leading-6 text-[#60748a]">
              {labels.intro}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="mt-5 flex gap-2">
            <label className="sr-only" htmlFor="tuuma-question">{labels.placeholder}</label>
            <input
              id="tuuma-question"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.placeholder}
              className="min-w-0 flex-1 rounded-2xl border border-[#cfdbe6] bg-white px-4 py-3 text-base"
            />
            <button
              type="submit"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#102e4e] text-white disabled:opacity-40"
              disabled={!query.trim()}
              aria-label={text({ fi: "Lähetä", en: "Send", sv: "Skicka" })}
            >
              <Send size={18} />
            </button>
          </form>

          {!selected && (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {answers.slice(0, 4).map((item) => (
                <button
                  key={item.questions.fi}
                  onClick={() => choose(item)}
                  className="rounded-2xl border border-[#dce5ed] px-4 py-3 text-left text-sm font-bold transition hover:border-[#88afe0] hover:bg-[#f3f8fd]"
                >
                  {item.questions[locale]}
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div className={`mt-5 rounded-[24px] p-5 ${selected !== "unknown" && selected.urgent ? "bg-[#fff0ed]" : "bg-[#edf5ff]"}`}>
              {selected === "unknown" ? (
                <>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="mt-0.5 shrink-0 text-[#3d4785]" size={20} />
                    <p className="leading-7">{labels.unknown}</p>
                  </div>
                  <Link href="/asukkaille" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#3d4785] px-5 py-3 text-sm font-black text-white">
                    {text({ fi: "Ota yhteyttä", en: "Contact support", sv: "Kontakta kundtjänsten" })} <ArrowRight size={16} />
                  </Link>
                </>
              ) : (
                <>
                  {selected.urgent && (
                    <div className="mb-4 flex items-center gap-2 text-sm font-black text-[#a0382c]">
                      <AlertTriangle size={18} />
                      {text({ fi: "Toimi heti vahingon rajaamiseksi", en: "Act now to limit damage", sv: "Agera genast för att begränsa skadan" })}
                    </div>
                  )}
                  <p className="leading-7">{selected.body[locale]}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link href={selected.href} className="inline-flex items-center gap-2 rounded-full bg-[#3d4785] px-5 py-3 text-sm font-black text-white">
                      {selected.cta[locale]} <ArrowRight size={16} />
                    </Link>
                    <button onClick={() => setSourceOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#284b6c]">
                      <BookOpen size={16} /> {labels.source}
                    </button>
                  </div>
                  {sourceOpen && (
                    <div className="mt-4 rounded-2xl bg-white/75 p-4 text-sm text-[#4f6880]">
                      <b className="block text-[#173a5e]">{selected.source[locale]}</b>
                      <span className="mt-2 flex items-center gap-2"><CalendarClock size={15} />{labels.updated}</span>
                    </div>
                  )}
                </>
              )}
              <button onClick={() => { setSelected(undefined); setQuery(""); }} className="mt-5 text-sm font-black text-[#315b83]">
                {text({ fi: "Kysy toinen kysymys", en: "Ask another question", sv: "Ställ en annan fråga" })}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
