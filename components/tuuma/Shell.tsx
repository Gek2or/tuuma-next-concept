"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Heart, Languages, Menu, X } from "lucide-react";
import { useLanguage, type Locale } from "./LanguageProvider";

const nav = [
  { href: "/kohteet", label: { fi: "Asunnot", en: "Homes", sv: "Bostäder" } },
  { href: "/alueet", label: { fi: "Alueet", en: "Areas", sv: "Områden" } },
  { href: "/asukkaille", label: { fi: "Asukkaille", en: "For residents", sv: "För boende" } },
] as const;

const menuGroups = [
  { title: { fi: "Löydä koti", en: "Find a home", sv: "Hitta ett hem" }, links: [
    ...nav.slice(0, 2),
    { href: "/kohteet?favorites=1", label: { fi: "Suosikit", en: "Favourites", sv: "Favoriter" } },
    { href: "/kohteet/kalliolinna", label: { fi: "Kalliolinna · esimerkkikodit", en: "Kalliolinna · example homes", sv: "Kalliolinna · exempelhem" } },
    { href: "/kustannukset", label: { fi: "Asumiskustannukset", en: "Living costs", sv: "Boendekostnader" } },
    { href: "/hakemukseni", label: { fi: "Hakemukseni", en: "My application", sv: "Min ansökan" } },
  ] },
  { title: { fi: "Asukkaalle", en: "For residents", sv: "För boende" }, links: [
    { href: "/oma-koti", label: { fi: "Oma koti", en: "My home", sv: "Mitt hem" } },
    nav[2],
    { href: "/huolto", label: { fi: "Huoltopyynnöt", en: "Maintenance requests", sv: "Felanmälningar" } },
    { href: "/muutto", label: { fi: "Muuttoapuri", en: "Moving guide", sv: "Flyttguide" } },
    { href: "/energia", label: { fi: "Energia ja sisäilma", en: "Energy and indoor climate", sv: "Energi och inomhusklimat" } },
  ] },
  { title: { fi: "Konsepti", en: "Concept", sv: "Koncept" }, links: [
    { href: "/concept", label: { fi: "Konseptin esittely", en: "Concept presentation", sv: "Konceptpresentation" } },
    { href: "/demo-admin", label: { fi: "Henkilöstön demo", en: "Staff demo", sv: "Personaldemo" } },
  ] },
] as const;

export function SiteHeader() {
  const { locale, setLocale, text } = useLanguage();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); menuButtonRef.current?.focus(); }
    };
    const outside = (e: PointerEvent) => {
      if (e.target instanceof Node && !headerRef.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", close);
    window.addEventListener("pointerdown", outside);
    return () => { window.removeEventListener("keydown", close); window.removeEventListener("pointerdown", outside); };
  }, [open]);
  useEffect(() => { setOpen(false); }, [pathname]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () =>
      setCount(JSON.parse(localStorage.getItem("tuuma-favorites") || "[]").length);
    sync();
    window.addEventListener("tuuma-favorites", sync);
    return () => window.removeEventListener("tuuma-favorites", sync);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-[#dce6ef]/80 bg-white/95 backdrop-blur-xl">
      <div className="shell flex h-[72px] items-center justify-between gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Tuuma Next">
          <span className="grid h-10 w-10 -rotate-6 place-items-center rounded-[11px] bg-[#ffbb18] text-lg font-black text-[#22264b]">T°</span>
          <span>
            <b className="block text-[17px] leading-none tracking-[-.03em]">Tuuma Next</b>
            <small className="mt-1 block text-xs font-bold uppercase tracking-[.1em] text-[#6b7f95]">Concept / Demo</small>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex" aria-label={text({ fi: "Päänavigaatio", en: "Main navigation", sv: "Huvudnavigation" })}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? "page" : undefined} className="text-sm font-bold text-[#3c536c] transition hover:text-[#3d4785]">
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
          <Link href="/kohteet?favorites=1" className="relative hidden h-11 w-11 place-items-center rounded-full bg-white text-[#173451] shadow-sm min-[400px]:grid" aria-label={`${text({ fi: "Suosikit", en: "Favourites", sv: "Favoriter" })} ${count}`}>
            <Heart size={19} />
            {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#3d4785] px-1 text-[10px] font-bold text-white">{count}</span>}
          </Link>
          <Link href="/oma-koti" className="hidden rounded-full bg-[#102d4d] px-5 py-3 text-sm font-black text-white transition hover:bg-[#3d4785] lg:block">
            {text({ fi: "Oma koti", en: "My home", sv: "Mitt hem" })}
          </Link>
          <button ref={menuButtonRef} onClick={() => setOpen((value) => !value)} className={`flex h-11 shrink-0 items-center gap-2 rounded-full border px-3 text-sm font-bold transition sm:px-4 ${open ? "border-[#22264b] bg-[#22264b] text-white" : "border-[#d8e2eb] bg-white text-[#22264b] hover:bg-[#f2f3f8]"}`} aria-controls="site-menu" aria-label={text(open ? { fi: "Sulje valikko", en: "Close menu", sv: "Stäng menyn" } : { fi: "Avaa valikko", en: "Open menu", sv: "Öppna menyn" })} aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
            <span>{text({ fi: "Valikko", en: "Menu", sv: "Meny" })}</span>
          </button>
        </div>
      </div>

      <div aria-hidden className="h-[3px] bg-[linear-gradient(90deg,#3d4785_0%,#3d4785_33%,#e97770_33%,#e97770_66%,#ffbb18_66%)]"/>
      {open && (
        <nav id="site-menu" aria-label={text({fi:"Kaikki osiot",en:"All sections",sv:"Alla avsnitt"})} className="absolute inset-x-0 top-full max-h-[calc(100dvh-76px)] overflow-y-auto border-b border-[#d8e2eb] bg-white shadow-xl">
          <div className="shell py-6 sm:py-8">
          <div className="mb-1 flex rounded-2xl bg-[#e7f0f8] p-1 sm:hidden" role="group" aria-label={text({ fi: "Kieli", en: "Language", sv: "Språk" })}>
            {(["fi", "en", "sv"] as Locale[]).map((item) => (
              <button key={item} onClick={() => setLocale(item)} className={`min-h-10 flex-1 rounded-xl text-xs font-black uppercase ${locale === item ? "bg-white text-[#3d4785] shadow-sm" : "text-[#536b83]"}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-10">
            {menuGroups.map(group => <section key={group.title.en}>
              <h2 className="mb-2 border-b border-[#e5e6ed] pb-3 text-sm font-bold uppercase tracking-wide text-[#62677f]">{text(group.title)}</h2>
              <ul>{group.links.map(item => <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} aria-current={pathname === item.href ? "page" : undefined} className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 py-3 text-sm font-semibold text-[#22264b] hover:bg-[#f2f3f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3d4785]">
                  {text(item.label)}<ArrowUpRight size={16} aria-hidden className="shrink-0 text-[#62677f]" />
                </Link>
              </li>)}</ul>
            </section>)}
          </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { text } = useLanguage();
  return (
    <footer className="mt-12 bg-[#22264b] py-12 text-white">
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
          <h2 className="font-black">{text({fi:"Tietoa konseptista",en:"About the concept",sv:"Om konceptet"})}</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#b8cee5]">
            <Link href="/demo-admin">{text({ fi: "Henkilöstönäkymä", en: "Staff view", sv: "Personalvy" })}</Link>
            <Link href="/concept">{text({fi:"Konseptin esittely",en:"Concept presentation",sv:"Konceptpresentation"})}</Link>
            <Link href="/kohteet/kalliolinna">{text({fi:"Kolme esimerkkikotia",en:"Three example homes",sv:"Tre exempelhem"})}</Link>
            <span>Suomi · English · Svenska</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
