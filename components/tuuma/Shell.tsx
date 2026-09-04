"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Heart, Languages, Menu, X } from "lucide-react";
import { useLanguage, type Locale } from "./LanguageProvider";

const nav = [
  { href: "/kohteet", label: { fi: "Kodit", en: "Homes", sv: "Bostäder" } },
  { href: "/alueet", label: { fi: "Alueet", en: "Areas", sv: "Områden" } },
  { href: "/asukkaille", label: { fi: "Palvelut", en: "Services", sv: "Tjänster" } },
  { href: "/oma-koti", label: { fi: "Oma koti", en: "My home", sv: "Mitt hem" } },
  { href: "/concept", label: { fi: "Konsepti", en: "Concept", sv: "Koncept" } },
] as const;

export function SiteHeader() {
  const { locale, setLocale, text } = useLanguage();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () =>
      setCount(JSON.parse(localStorage.getItem("tuuma-favorites") || "[]").length);
    sync();
    window.addEventListener("tuuma-favorites", sync);
    return () => window.removeEventListener("tuuma-favorites", sync);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#dce6ef]/80 bg-[#f8fbfd]/92 backdrop-blur-xl">
      <div className="shell flex h-[72px] items-center justify-between gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Tuuma Next">
          <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#0a55df] text-[15px] font-black text-white">T°</span>
          <span>
            <b className="block text-[17px] leading-none tracking-[-.03em]">Tuuma Next</b>
            <small className="mt-1 block text-[9px] font-bold uppercase tracking-[.18em] text-[#6b7f95]">Concept / Demo</small>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 xl:flex" aria-label={text({ fi: "Päänavigaatio", en: "Main navigation", sv: "Huvudnavigation" })}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-bold text-[#3c536c] transition hover:text-[#0a55df]">
              {text(item.label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <label className="relative hidden items-center sm:flex">
            <span className="sr-only">{text({ fi: "Kieli", en: "Language", sv: "Språk" })}</span>
            <Languages className="pointer-events-none absolute left-3 text-[#45617c]" size={16} />
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
              className="h-11 appearance-none rounded-full border border-[#d8e2eb] bg-white py-0 pl-9 pr-8 text-xs font-black uppercase tracking-wide text-[#274765]"
              aria-label={text({ fi: "Valitse kieli", en: "Select language", sv: "Välj språk" })}
            >
              <option value="fi">FI</option>
              <option value="en">EN</option>
              <option value="sv">SV</option>
            </select>
          </label>
          <Link href="/kohteet?favorites=1" className="relative grid h-11 w-11 place-items-center rounded-full bg-white text-[#173451] shadow-sm" aria-label={`${text({ fi: "Suosikit", en: "Favourites", sv: "Favoriter" })} ${count}`}>
            <Heart size={19} />
            {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#0a55df] px-1 text-[10px] font-bold text-white">{count}</span>}
          </Link>
          <Link href="/kohteet" className="hidden rounded-full bg-[#102d4d] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0a55df] lg:block">
            {text({ fi: "Etsi koti", en: "Find a home", sv: "Hitta en bostad" })}
          </Link>
          <button onClick={() => setOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-full bg-white xl:hidden" aria-label={text({ fi: "Avaa valikko", en: "Open menu", sv: "Öppna menyn" })} aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="shell grid gap-2 pb-5 xl:hidden">
          <div className="mb-1 flex rounded-2xl bg-[#e7f0f8] p-1 sm:hidden" role="group" aria-label={text({ fi: "Kieli", en: "Language", sv: "Språk" })}>
            {(["fi", "en", "sv"] as Locale[]).map((item) => (
              <button key={item} onClick={() => setLocale(item)} className={`min-h-10 flex-1 rounded-xl text-xs font-black uppercase ${locale === item ? "bg-white text-[#0a55df] shadow-sm" : "text-[#536b83]"}`}>
                {item}
              </button>
            ))}
          </div>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 font-black">
              {text(item.label)} <ArrowUpRight size={17} />
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-2">
            <Link href="/hakemukseni" onClick={() => setOpen(false)} className="rounded-2xl bg-[#e6f1ff] px-4 py-4 text-sm font-black text-[#174b83]">
              {text({ fi: "Hakemukseni", en: "My application", sv: "Min ansökan" })}
            </Link>
            <Link href="/demo-admin" onClick={() => setOpen(false)} className="rounded-2xl bg-[#102e4e] px-4 py-4 text-sm font-black text-white">
              Admin demo
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { text } = useLanguage();
  return (
    <footer className="mt-24 bg-[#0c2948] py-12 text-white">
      <div className="shell grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="eyebrow !text-[#8fb9e8]">Tuuma Digital Living Concept</p>
          <p className="display mt-4 max-w-md text-3xl">{text({ fi: "Parempi arki alkaa selkeästä palvelusta.", en: "Better everyday life starts with a clear service.", sv: "En bättre vardag börjar med en tydlig tjänst." })}</p>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#b8cee5]">{text({ fi: "Itsenäinen konseptidemo. Ei Tuuma Kodit Oy:n virallinen verkkopalvelu.", en: "Independent concept demo. Not an official Tuuma Kodit Oy service.", sv: "Oberoende konceptdemo. Inte Tuuma Kodit Oy:s officiella tjänst." })}</p>
        </div>
        <div>
          <h2 className="font-black">{text({ fi: "Asiointi", en: "Services", sv: "Tjänster" })}</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#b8cee5]">
            <Link href="/oma-koti">{text({ fi: "Oma koti", en: "My home", sv: "Mitt hem" })}</Link>
            <Link href="/hakemukseni">{text({ fi: "Hakemukseni", en: "My application", sv: "Min ansökan" })}</Link>
            <Link href="/huolto">Huolto Live</Link>
            <Link href="/muutto">{text({ fi: "Muuttoapuri", en: "Moving guide", sv: "Flyttguide" })}</Link>
          </div>
        </div>
        <div>
          <h2 className="font-black">Demo</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#b8cee5]">
            <Link href="/demo-admin">{text({ fi: "Henkilöstönäkymä", en: "Staff view", sv: "Personalvy" })}</Link>
            <Link href="/kustannukset">{text({ fi: "Kokonaiskustannus", en: "Total monthly cost", sv: "Total månadskostnad" })}</Link>
            <Link href="/energia">{text({ fi: "Energia ja sisäilma", en: "Energy and indoor climate", sv: "Energi och inomhusklimat" })}</Link>
            <span>Suomi · English · Svenska</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
