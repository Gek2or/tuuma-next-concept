"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Images, LayoutPanelTop, Box, Scan, Share2, MapPin } from "lucide-react";
import { apartments, type Apartment } from "@/lib/data";
import { HomeDetails } from "./HomeDetails";
import { ApartmentGallery } from "./ApartmentGallery";
import { ApartmentPlan } from "./ApartmentPlan";
import { useLanguage } from "./LanguageProvider";

const Model = dynamic(() => import("./ApartmentDollhouse"), { ssr: false, loading: () => <div className="showcase-loading">3D…</div> });
const Tour = dynamic(() => import("./Tour360Viewer"), { ssr: false, loading: () => <div className="showcase-loading">360°…</div> });
const homes = apartments.filter(a => ["C09", "E15", "F20"].includes(a.id));
const stories = {
  C09: { fi: "Oma rauha. Oma terassi.", en: "Your own space. Your own terrace.", sv: "Eget lugn. Egen terrass." },
  E15: { fi: "Arki alhaalla. Lepo ylhäällä.", en: "Living downstairs. Rest upstairs.", sv: "Vardag nere. Vila uppe." },
  F20: { fi: "Tilaa koko perheen tarinalle.", en: "Room for your family's story.", sv: "Plats för hela familjens berättelse." },
};
export function ThreeHomeCards() {
  const { text } = useLanguage();
  return <section className="shell py-12 sm:py-20" aria-label={text({ fi: "Kolme esimerkkikotia", en: "Three example homes", sv: "Tre exempelhem" })}>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">KALLIOLINNA · CONCEPT</p><h2 className="display mt-3 text-3xl sm:text-5xl">{text({ fi: "Kolme kotia. Kolme tapaa asua.", en: "Three homes. Three ways to live.", sv: "Tre hem. Tre sätt att bo." })}</h2></div><Link className="text-sm font-bold underline underline-offset-4" href="/kohteet">{text({ fi: "Kaikki esimerkkiasunnot", en: "All example homes", sv: "Alla exempelbostäder" })}</Link></div>
    <div className="grid gap-5 md:grid-cols-3">{homes.map((home, i) => <Link key={home.id} href={`/kohteet/kalliolinna?asunto=${home.id}`} className={`showcase-card showcase-card-${i}`}><div className="relative overflow-hidden"><img src={home.image} alt={`${home.title} · ${text({ fi: "konseptikuva", en: "concept image", sv: "konceptbild" })}`} width="1536" height="1024" loading="lazy" className="aspect-[3/2] w-full object-cover transition duration-500 hover:scale-105"/><span className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-xs font-bold">{home.id} · {home.size.toString().replace(".", ",")} m²</span></div><div className="p-6"><p className="text-sm font-semibold">{home.layoutLabel} · {home.levels} {text({ fi: "taso(a)", en: "level(s)", sv: "plan" })}</p><h3 className="mt-3 text-2xl font-extrabold leading-tight">{text(stories[home.id as keyof typeof stories])}</h3><div className="mt-6 flex items-center justify-between border-t border-current/20 pt-4"><span className="text-sm font-bold">{text({ fi: "Tutki kotia", en: "Explore home", sv: "Utforska hemmet" })}</span><ArrowRight size={21}/></div></div></Link>)}</div>
  </section>;
}

export function ShowcaseHomes({ apartment }: { apartment: Apartment }) {
  const { locale, text } = useLanguage();
  const [view, setView] = useState<"photos" | "plan" | "model" | "tour">("photos");
  const [saved, setSaved] = useState(false), [notice, setNotice] = useState("");
  const copy = (fi: string, en: string, sv: string) => text({ fi, en, sv });
  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem("tuuma-favorites") || "[]").includes(apartment.id)); } catch { setSaved(false); }
  }, [apartment.id]);
  function favourite() {
    let items: string[] = [];
    try { items = JSON.parse(localStorage.getItem("tuuma-favorites") || "[]"); } catch { /* Recover malformed local preferences. */ }
    const next = items.includes(apartment.id) ? items.filter(id => id !== apartment.id) : [...items, apartment.id];
    try { localStorage.setItem("tuuma-favorites", JSON.stringify(next)); setSaved(next.includes(apartment.id)); window.dispatchEvent(new Event("tuuma-favorites")); } catch { setNotice(copy("Tallennus ei ole käytettävissä selaimessa.", "Storage is unavailable in this browser.", "Lagring är inte tillgänglig i webbläsaren.")); }
  }
  async function share() {
    const url = new URL(`/kohteet/kalliolinna?asunto=${apartment.id}`, location.origin).href;
    try { if (navigator.share) await navigator.share({ title: apartment.title, url }); else { await navigator.clipboard.writeText(url); setNotice(copy("Linkki kopioitu", "Link copied", "Länk kopierad")); } }
    catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setNotice(copy("Kopioi osoite selaimen osoiteriviltä.", "Copy the address from your browser.", "Kopiera adressen från webbläsaren.")); }
  }
  const tabs = [
    { id: "photos", icon: Images, label: copy("Kuvat", "Images", "Bilder") },
    { id: "plan", icon: LayoutPanelTop, label: copy("Pohja", "Plan", "Planritning") },
    { id: "model", icon: Box, label: "3D" },
    { id: "tour", icon: Scan, label: "360°" },
  ] as const;
  const money = new Intl.NumberFormat(locale === "sv" ? "sv-FI" : locale === "en" ? "en-FI" : "fi-FI", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(apartment.rent);
  return <div className="showcase-page">
    <div className="shell pt-7"><Link href="/kohteet" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold"><ArrowLeft size={16}/>{copy("Asuntohakuun", "Back to home search", "Till bostadssökning")}</Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">MAHLAMÄENTIE 14 · HYRYLÄ</p><h1 className="display mt-3 text-5xl sm:text-7xl">{apartment.title}</h1><p className="mt-4 max-w-2xl text-xl leading-relaxed">{text(stories[apartment.id as keyof typeof stories])}</p></div><span className="rounded-full border border-[#3d4785]/30 bg-white px-4 py-2 text-xs font-bold tracking-wider">CONCEPT / DEMO</span></div>
      <nav className="my-7 grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3" aria-label={copy("Valitse esimerkkikoti", "Choose example home", "Välj exempelhem")}>{homes.map(home => <Link key={home.id} href={`/kohteet/kalliolinna?asunto=${home.id}`} aria-current={home.id === apartment.id ? "page" : undefined} className={`rounded-xl border p-3 sm:p-4 ${home.id === apartment.id ? "border-[#22264b] bg-[#22264b] text-white" : "border-[#d6d8e5] bg-white"}`}><b className="block text-base">{home.id}</b><span className="mt-1 block text-xs sm:text-sm">{home.size.toString().replace(".", ",")} m² · {home.rooms}H</span></Link>)}</nav>
      <a href="#home-details" className="mb-6 inline-flex min-h-11 items-center text-sm font-bold underline underline-offset-4">{copy("Talon ja asunnon kaikki tiedot ↓", "Full house and apartment details ↓", "Alla uppgifter om huset och bostaden ↓")}</a>
      <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0" aria-label={copy("Tutustu asuntoon", "Explore the apartment", "Utforska bostaden")}>
          <div className="showcase-tabs" role="tablist" aria-label={copy("Esitystapa", "View", "Visningsläge")}>{tabs.map(({ id, icon: Icon, label }) => <button key={id} id={`home-tab-${id}`} role="tab" aria-selected={view === id} aria-controls="home-panel" tabIndex={view === id ? 0 : -1} onKeyDown={e => { const index = tabs.findIndex(t => t.id === id); const next = e.key === "ArrowRight" ? (index + 1) % tabs.length : e.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : -1; if (next >= 0) { e.preventDefault(); setView(tabs[next].id); document.getElementById(`home-tab-${tabs[next].id}`)?.focus(); } }} onClick={() => setView(id)}><Icon size={18}/>{label}</button>)}</div>
          <div id="home-panel" role="tabpanel" aria-labelledby={`home-tab-${view}`} tabIndex={0} className="mt-5 min-w-0 focus:outline-none">
            {view === "photos" && <ApartmentGallery key={apartment.id} apartment={apartment}/>}
            {view === "plan" && <ApartmentPlan key={apartment.id} initialApartment={apartment.id}/>}
            {view === "model" && <Model key={apartment.id} apartment={apartment}/>}
            {view === "tour" && <Tour key={apartment.id} apartment={apartment}/>}
          </div>
        </section>
        <aside className="showcase-details xl:sticky xl:top-24"><p className="text-sm font-semibold">{apartment.layoutLabel}</p><p className="mt-2 text-4xl font-extrabold tracking-tight">{apartment.size.toString().replace(".", ",")} <span className="text-lg">m²</span></p><p className="mt-4 text-2xl font-bold">{money}<span className="text-sm font-normal"> / {copy("kk", "month", "mån")}</span></p><p className="mt-1 text-xs text-[#535873]">{copy("Esimerkkivuokra · ei vuokratarjous", "Illustrative rent · not a rental offer", "Exempelhyra · inget hyreserbjudande")}</p><p className="mt-5 flex gap-2 text-sm leading-6"><MapPin size={18} className="mt-1 shrink-0"/>{apartment.address}</p><dl className="mt-5 space-y-3 border-y border-[#d8dae5] py-5 text-sm"><div className="flex justify-between"><dt>{copy("Tasot", "Levels", "Våningar")}</dt><dd className="font-bold">{apartment.levels}</dd></div><div className="flex justify-between"><dt>{copy("Ulkotila", "Outdoor space", "Uteplats")}</dt><dd className="font-bold">{copy("Oma terassi", "Private terrace", "Egen terrass")}</dd></div><div className="flex justify-between"><dt>{copy("Lemmikit", "Pets", "Husdjur")}</dt><dd className="font-bold">{copy("Tervetuloa", "Welcome", "Välkomna")}</dd></div></dl><Link href={`/hae?asunto=${apartment.id}`} className="showcase-primary mt-5">{copy("Aloita hakemus", "Start application", "Starta ansökan")}<ArrowRight size={18}/></Link><details className="mt-4 text-sm"><summary className="cursor-pointer py-3 font-semibold">{copy("Muut toiminnot", "More actions", "Fler åtgärder")}</summary><Link href="/kohteet?compare=C09,E15,F20" className="flex min-h-11 items-center justify-center text-sm font-bold underline underline-offset-4">{copy("Vertaa kolmea kotia", "Compare three homes", "Jämför tre hem")}</Link><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={favourite} aria-pressed={saved} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-white text-sm font-semibold"><Heart size={17} fill={saved ? "currentColor" : "none"}/>{saved ? copy("Tallennettu", "Saved", "Sparad") : copy("Tallenna", "Save", "Spara")}</button><button onClick={() => void share()} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-white text-sm font-semibold"><Share2 size={17}/>{copy("Jaa", "Share", "Dela")}</button></div></details><p role="status" className="mt-2 text-sm">{notice}</p></aside>
      </div>
      <HomeDetails apartment={apartment}/>
      <p className="max-w-4xl text-sm leading-6 text-[#62677f]">{copy("Julkiset osoite-, tyyppi- ja kokotiedot: Tuuma Kodit. Mallit, piirustukset ja kuvat ovat itsenäistä konseptisuunnittelua. Kuvat havainnollistavat sisustuksen tunnelmaa; mitat ja huonejako tarkastellaan pohjassa ja 3D:ssä.", "Public address, type and size information: Tuuma Kodit. Models, drawings and images are independent concept work. Images illustrate interior atmosphere; use the plan and 3D for dimensions and room layout.", "Offentliga adress-, typ- och storleksuppgifter: Tuuma Kodit. Modeller, ritningar och bilder är självständigt konceptarbete. Bilderna visar inredningens stämning; mått och rumsindelning visas i plan och 3D.")} <a className="underline" href="https://tuumakodit.fi/kalliolinna/" target="_blank" rel="noreferrer">{copy("Lähde", "Source", "Källa")}</a></p>
    </div>
    <div className="mobile-apply-cta fixed inset-x-3 z-40 flex items-center justify-between gap-3 rounded-2xl border border-[#d8dae5] bg-white p-3 shadow-lg xl:hidden"><span className="text-sm font-bold text-[#22264b]">{apartment.id} · {apartment.size} m²</span><Link href={`/hae?asunto=${apartment.id}`} className="showcase-primary px-5">{copy("Aloita hakemus", "Start application", "Starta ansökan")}<ArrowRight size={17}/></Link></div>
  </div>;
}
