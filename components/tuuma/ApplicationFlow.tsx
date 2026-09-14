"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check, ExternalLink, LockKeyhole } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { apartments } from "@/lib/data";
import { useLanguage } from "./LanguageProvider";

export function ApplicationFlow() {
  const id = useSearchParams().get("asunto") || "A12";
  const { text, locale } = useLanguage();
  const home = apartments.find(apartment => apartment.id === id);
  const [step, setStep] = useState(0);

  return (
    <section className="shell py-14 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Application handoff / demo</p>
        <h1 className="display mt-4 text-5xl sm:text-6xl">
          {text({ fi: "Hae kotiin", en: "Apply for home", sv: "Ansök om bostad" })} {id}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#60758a]">
          {text({
            fi: "Uusi asiakaspolku kerää vain tarvittavat esitäytöt. Varsinainen hakemus jatkuu turvallisesti nykyisessä Tampuuri-palvelussa.",
            en: "The new customer journey prepares only the required details. The application continues securely in the existing Tampuuri service.",
            sv: "Den nya kundresan förbereder bara nödvändiga uppgifter. Ansökan fortsätter tryggt i den befintliga Tampuuri-tjänsten.",
          })}
        </p>
        <div className="mt-9 rounded-[30px] bg-white p-6 shadow-[0_22px_65px_rgba(22,54,88,.1)] sm:p-10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black">
              {step < 2
                ? text({ fi: "Vaihe", en: "Step", sv: "Steg" }) + " " + (step + 1) + " / 2"
                : text({ fi: "Valmis siirtymään", en: "Ready to continue", sv: "Klar att fortsätta" })}
            </span>
            <span className="text-sm font-bold text-[#0a55df]">{text({ fi: "Asunto", en: "Home", sv: "Bostad" })} {id}</span>
          </div>
          <Progress value={step === 0 ? 50 : 100} className="mt-4" />

          {step === 0 && (
            <div className="mt-9">
              <h2 className="display text-4xl">{text({ fi: "Tarkista valittu koti", en: "Review the selected home", sv: "Granska den valda bostaden" })}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  [text({ fi: "Kohde", en: "Property", sv: "Objekt" }), "Kalliolinna"],
                  [text({ fi: "Asunto", en: "Home", sv: "Bostad" }), id],
                  [text({ fi: "Esimerkkivuokra", en: "Example rent", sv: "Exempelhyra" }), home ? new Intl.NumberFormat(locale === "fi" ? "fi-FI" : locale === "sv" ? "sv-FI" : "en-GB", { style: "currency", currency: "EUR" }).format(home.rent) + text({fi:" / kk",en:" / month",sv:" / mån"}) : "—"],
                ].map((item) => <div key={item[0]} className="rounded-2xl bg-[#eef4f9] p-4"><small className="text-[#6b7f93]">{item[0]}</small><b className="mt-1 block">{item[1]}</b></div>)}
              </div>
              <button onClick={() => setStep(1)} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#0a55df] py-4 font-black text-white">
                {text({ fi: "Jatka hakemukseen", en: "Continue to application", sv: "Fortsätt till ansökan" })}<ArrowRight />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="mt-9">
              <h2 className="display text-4xl">{text({ fi: "Perustiedot siirtyvät mukana", en: "The essentials follow you", sv: "Grunduppgifterna följer med" })}</h2>
              <p className="mt-4 leading-7 text-[#60758a]">
                {text({ fi: "Asuntotunnus esitäytetään. Tampuuri vastaa tunnistautumisesta, hakemuksesta ja tietojen käsittelystä.", en: "The home ID is prefilled. Tampuuri handles identification, the application and data processing.", sv: "Bostads-ID fylls i automatiskt. Tampuuri hanterar identifiering, ansökan och databehandling." })}
              </p>
              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#e7f6ef] p-5 text-sm font-semibold text-[#146652]">
                <LockKeyhole className="shrink-0" />
                {text({ fi: "Taustajärjestelmä säilyy ennallaan. Tämä demo näyttää paremman handoff-kokemuksen.", en: "The back-office system remains unchanged. This demo shows a better handoff.", sv: "Bakgrundssystemet förblir oförändrat. Demon visar en bättre övergång." })}
              </div>
              <button onClick={() => setStep(2)} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#0a55df] py-4 font-black text-white">
                {text({ fi: "Avaa Tampuuri-demo", en: "Open Tampuuri demo", sv: "Öppna Tampuuri-demo" })}<ExternalLink />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="py-12 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e1f5ec] text-[#08765f]"><Check size={30} /></span>
              <h2 className="display mt-6 text-4xl">{text({ fi: "Handoff valmis", en: "Handoff complete", sv: "Övergången är klar" })}</h2>
              <p className="mx-auto mt-4 max-w-md leading-7 text-[#60758a]">
                {text({ fi: "Tuotannossa käyttäjä siirtyisi nyt Tampuurin hakemukseen valittu asunto esitäytettynä.", en: "In production, the user would now continue to Tampuuri with the selected home prefilled.", sv: "I produktion skulle användaren nu fortsätta till Tampuuri med den valda bostaden ifylld." })}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link href="/hakemukseni" className="inline-flex items-center gap-2 rounded-full bg-[#0a55df] px-6 py-3 font-black text-white">
                  {text({ fi: "Näytä hakemuksen seuranta", en: "View application tracking", sv: "Visa ansökningsuppföljning" })}<ArrowRight size={17} />
                </Link>
                <Link href="/kohteet" className="inline-flex rounded-full border px-6 py-3 font-black">
                  {text({ fi: "Takaisin koteihin", en: "Back to homes", sv: "Tillbaka till bostäder" })}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
