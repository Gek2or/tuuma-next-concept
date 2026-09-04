"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  Heart,
  Map,
  MapPin,
  Rows3,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { apartments, Apartment } from "@/lib/data";
import { useLanguage } from "./LanguageProvider";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const features = [
  { k: "pets", l: { fi: "Lemmikit", en: "Pets", sv: "Husdjur" } },
  { k: "accessible", l: { fi: "Esteetön", en: "Accessible", sv: "Tillgänglig" } },
  { k: "parking", l: { fi: "Autopaikka", en: "Parking", sv: "Bilplats" } },
  { k: "ev", l: { fi: "EV-lataus", en: "EV charging", sv: "Elbilsladdning" } },
  { k: "sauna", l: { fi: "Sauna", en: "Sauna", sv: "Bastu" } },
  { k: "balcony", l: { fi: "Parveke", en: "Balcony", sv: "Balkong" } },
] as const;
function Card({
  a,
  favorite,
  onFavorite,
  onCompare,
  compared,
  list,
}: {
  a: Apartment;
  favorite: boolean;
  onFavorite: () => void;
  onCompare: () => void;
  compared: boolean;
  list: boolean;
}) {
  const { text } = useLanguage();
  return (
    <article
      className={`group overflow-hidden rounded-[26px] border border-[#dce6ee] bg-white ${list ? "sm:grid sm:grid-cols-[240px_1fr]" : ""}`}
    >
      <div
        className={`relative overflow-hidden ${list ? "h-56 sm:h-full" : "h-60"}`}
      >
        <img
          src={a.image}
          alt={`${a.title}, ${text({ fi: "asunnon sisäkuva", en: "interior", sv: "interiör" })}`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs font-bold">
          {a.available}
        </span>
        <button
          onClick={onFavorite}
          className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full ${favorite ? "bg-[#0a55df] text-white" : "bg-white text-[#173b60]"}`}
          aria-label={favorite ? text({ fi: "Poista suosikeista", en: "Remove from favourites", sv: "Ta bort från favoriter" }) : text({ fi: "Lisää suosikkeihin", en: "Add to favourites", sv: "Lägg till i favoriter" })}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{a.area}</p>
            <h2 className="mt-2 text-xl font-black tracking-[-.025em]">
              {a.title}
            </h2>
            <p className="mt-1 text-sm text-[#667b90]">{a.address}</p>
          </div>
          <b className="whitespace-nowrap text-lg">
            {a.rent} €
            <small className="block text-right text-xs font-medium text-[#718195]">
              / kk
            </small>
          </b>
        </div>
        <p className="mt-5 font-bold text-[#355676]">
          {a.rooms}h · {a.size} m² · {a.floor}. kerros
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {a.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-[#edf4fb] px-3 py-1.5 text-xs font-semibold text-[#46637f]"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-[#e5ebf0] pt-4">
          <button
            onClick={onCompare}
            className={`flex items-center gap-2 text-sm font-bold ${compared ? "text-[#0a55df]" : "text-[#526a82]"}`}
          >
            {compared ? (
              <Check size={16} />
            ) : (
              <span className="h-4 w-4 rounded border border-[#9dafc0]" />
            )}
            {text({ fi: "Vertaa", en: "Compare", sv: "Jämför" })}
          </button>
          <Link
            href="/kohteet/kalliolinna"
            className="flex items-center gap-2 text-sm font-black text-[#0a55df]"
          >
            {text({ fi: "Tutustu", en: "Explore", sv: "Utforska" })} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
function CompareTable({ ids }: { ids: string[] }) {
  const { text } = useLanguage();
  const list = apartments.filter((a) => ids.includes(a.id));
  const rows: Array<[string, (a: Apartment) => React.ReactNode]> = [
    [text({ fi: "Vuokra", en: "Rent", sv: "Hyra" }), (a) => `${a.rent} €/kk`],
    [text({ fi: "Pinta-ala", en: "Size", sv: "Yta" }), (a) => `${a.size} m²`],
    [text({ fi: "Huoneet", en: "Rooms", sv: "Rum" }), (a) => `${a.rooms}h`],
    [text({ fi: "Alue", en: "Area", sv: "Område" }), (a) => a.area],
    [text({ fi: "Parveke", en: "Balcony", sv: "Balkong" }), (a) => (a.balcony ? text({ fi: "Kyllä", en: "Yes", sv: "Ja" }) : "—")],
    [text({ fi: "Sauna", en: "Sauna", sv: "Bastu" }), (a) => (a.sauna ? text({ fi: "Kyllä", en: "Yes", sv: "Ja" }) : "—")],
    [text({ fi: "EV-lataus", en: "EV charging", sv: "Elbilsladdning" }), (a) => (a.ev ? text({ fi: "Kyllä", en: "Yes", sv: "Ja" }) : "—")],
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr>
            <th className="p-3 text-sm text-[#63778d]">{text({ fi: "Ominaisuus", en: "Feature", sv: "Egenskap" })}</th>
            {list.map((a) => (
              <th key={a.id} className="p-3">
                <span className="block text-xs text-[#0a55df]">{a.id}</span>
                {a.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([l, fn]) => (
            <tr key={l} className="border-t border-[#e1e8ef]">
              <th className="p-3 text-sm font-semibold text-[#60758a]">{l}</th>
              {list.map((a) => (
                <td key={a.id} className="p-3 font-bold">
                  {fn(a)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function ApartmentSearch() {
  const { text } = useLanguage();
  const [area, setArea] = useState("all");
  const [rooms, setRooms] = useState("all");
  const [maxRent, setMaxRent] = useState("1200");
  const [checked, setChecked] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "list" | "map">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [alertSaved, setAlertSaved] = useState(false);
  useEffect(
    () =>
      queueMicrotask(() =>
        setFavorites(JSON.parse(localStorage.getItem("tuuma-favorites") || "[]")),
      ),
    [],
  );
  const filtered = useMemo(
    () =>
      apartments.filter(
        (a) =>
          (area === "all" || a.area === area) &&
          (rooms === "all" || a.rooms === Number(rooms)) &&
          a.rent <= Number(maxRent) &&
          checked.every((k) => Boolean(a[k as keyof Apartment])),
      ),
    [area, rooms, maxRent, checked],
  );
  function fav(id: string) {
    const next = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [...favorites, id];
    setFavorites(next);
    localStorage.setItem("tuuma-favorites", JSON.stringify(next));
    window.dispatchEvent(new Event("tuuma-favorites"));
  }
  function cmp(id: string) {
    setCompare((s) =>
      s.includes(id)
        ? s.filter((x) => x !== id)
        : s.length < 3
          ? [...s, id]
          : s,
    );
  }
  function saveAlert() {
    const profile = { area, rooms, maxRent, features: checked, createdAt: new Date().toISOString() };
    localStorage.setItem("tuuma-search-alert", JSON.stringify(profile));
    setAlertSaved(true);
  }
  const filters = (
    <div className="grid gap-4 lg:grid-cols-4">
      <label className="grid gap-2 text-sm font-bold">
        {text({ fi: "Alue", en: "Area", sv: "Område" })}
        <NativeSelect
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="h-12 w-full rounded-xl bg-white"
        >
          <NativeSelectOption value="all">{text({ fi: "Kaikki alueet", en: "All areas", sv: "Alla områden" })}</NativeSelectOption>
          <NativeSelectOption value="Hyrylä">Hyrylä</NativeSelectOption>
          <NativeSelectOption value="Jokela">Jokela</NativeSelectOption>
          <NativeSelectOption value="Kellokoski">Kellokoski</NativeSelectOption>
        </NativeSelect>
      </label>
      <label className="grid gap-2 text-sm font-bold">
        {text({ fi: "Huoneet", en: "Rooms", sv: "Rum" })}
        <NativeSelect
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          className="h-12 w-full rounded-xl bg-white"
        >
          <NativeSelectOption value="all">{text({ fi: "Kaikki huoneet", en: "All room counts", sv: "Alla antal rum" })}</NativeSelectOption>
          {[1, 2, 3, 4].map((n) => (
            <NativeSelectOption key={n} value={n}>
              {n} {text({ fi: "huonetta", en: "rooms", sv: "rum" })}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </label>
      <label className="grid gap-2 text-sm font-bold">
        {text({ fi: "Vuokra enintään", en: "Maximum rent", sv: "Högsta hyra" })}
        <NativeSelect
          value={maxRent}
          onChange={(e) => setMaxRent(e.target.value)}
          className="h-12 w-full rounded-xl bg-white"
        >
          {[700, 850, 1000, 1200].map((n) => (
            <NativeSelectOption key={n} value={n}>
              {n} €/kk
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </label>
      <div className="grid gap-2">
        <span className="text-sm font-bold">{text({ fi: "Ominaisuudet", en: "Features", sv: "Egenskaper" })}</span>
        <div className="flex h-12 items-center gap-4 overflow-x-auto rounded-xl border border-[#cdd8e3] bg-white px-4">
          {features.slice(0, 3).map((f) => (
            <label
              key={f.k}
              className="flex shrink-0 items-center gap-2 text-sm font-semibold"
            >
              <Checkbox
                checked={checked.includes(f.k)}
                onCheckedChange={() =>
                  setChecked((s) =>
                    s.includes(f.k) ? s.filter((x) => x !== f.k) : [...s, f.k],
                  )
                }
              />
              {text(f.l)}
            </label>
          ))}
        </div>
      </div>
      <div className="col-span-full flex flex-wrap gap-4">
        {features.slice(3).map((f) => (
          <label
            key={f.k}
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <Checkbox
              checked={checked.includes(f.k)}
              onCheckedChange={() =>
                setChecked((s) =>
                  s.includes(f.k) ? s.filter((x) => x !== f.k) : [...s, f.k],
                )
              }
            />
            {text(f.l)}
          </label>
        ))}
      </div>
    </div>
  );
  return (
    <section className="shell py-10 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{text({ fi: "Vapaat kodit", en: "Available homes", sv: "Lediga bostäder" })}</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">{text({ fi: "Löydä oma koti", en: "Find your home", sv: "Hitta ditt hem" })}</h1>
          <p className="mt-4 text-[#61778d]">
            {filtered.length} {text({ fi: "kotia vastaa valintojasi", en: "homes match your choices", sv: "bostäder matchar dina val" })}
          </p>
        </div>
        <div
          className="flex rounded-full bg-white p-1 shadow-sm"
          role="group"
          aria-label={text({ fi: "Näkymä", en: "View", sv: "Vy" })}
        >
          {(
            [
              { k: "grid", i: MapPin, l: text({ fi: "Ruudukko", en: "Grid", sv: "Rutnät" }) },
              { k: "list", i: Rows3, l: text({ fi: "Lista", en: "List", sv: "Lista" }) },
              { k: "map", i: Map, l: text({ fi: "Kartta", en: "Map", sv: "Karta" }) },
            ] as const
          ).map(({ k, i: I, l }) => (
            <button
              key={k}
              onClick={() => setView(k)}
              className={`grid h-11 w-11 place-items-center rounded-full ${view === k ? "bg-[#102e4e] text-white" : "text-[#61778d]"}`}
              aria-label={l}
            >
              <I size={18} />
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => setMobileFilters((v) => !v)}
        className="mt-7 flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 font-bold shadow-sm lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={18} />
          {text({ fi: "Suodattimet", en: "Filters", sv: "Filter" })}
        </span>
        <span>{mobileFilters ? text({ fi: "Sulje", en: "Close", sv: "Stäng" }) : text({ fi: "Avaa", en: "Open", sv: "Öppna" })}</span>
      </button>
      <div
        className={`${mobileFilters ? "block" : "hidden"} mt-5 rounded-[26px] bg-[#e8f1fa] p-5 lg:block lg:p-7`}
      >
        {filters}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#cfdee9] pt-5">
          <div className="flex items-start gap-3"><Bell className="mt-0.5 text-[#0a55df]" size={19} /><div><b className="block text-sm">{text({ fi: "Hakuhälytys", en: "Search alert", sv: "Sökbevakning" })}</b><p className="mt-1 text-xs leading-5 text-[#60758a]">{text({ fi: "Saat tiedon, kun toiveitasi vastaava koti vapautuu.", en: "Get notified when a matching home becomes available.", sv: "Få ett meddelande när en matchande bostad blir ledig." })}</p></div></div>
          <button onClick={saveAlert} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-black ${alertSaved ? "bg-[#e5f6ee] text-[#08705b]" : "bg-[#0a55df] text-white"}`}>{alertSaved ? <CheckCircle2 size={17} /> : <Bell size={17} />}{alertSaved ? text({ fi: "Haku tallennettu", en: "Search saved", sv: "Sökningen sparad" }) : text({ fi: "Tallenna haku", en: "Save search", sv: "Spara sökning" })}</button>
        </div>
      </div>
      {view === "map" ? (
        <div className="relative mt-8 h-[600px] overflow-hidden rounded-[32px] bg-[#dbe8ef] soft-grid">
          <div className="absolute inset-0 opacity-45 [background:radial-gradient(ellipse_at_30%_20%,#fff_0_4%,transparent_5%),linear-gradient(35deg,transparent_46%,#fff_47%_50%,transparent_51%),linear-gradient(-25deg,transparent_48%,#fff_49%_52%,transparent_53%)]" />
          <div className="absolute left-[14%] top-[22%] rounded-2xl bg-white p-3 shadow-xl">
            <b>Hyrylä</b>
            <p className="text-sm text-[#0a55df]">2 {text({ fi: "kotia", en: "homes", sv: "bostäder" })}</p>
          </div>
          <div className="absolute left-[58%] top-[40%] rounded-2xl bg-white p-3 shadow-xl">
            <b>Jokela</b>
            <p className="text-sm text-[#0a55df]">2 {text({ fi: "kotia", en: "homes", sv: "bostäder" })}</p>
          </div>
          <div className="absolute bottom-[17%] right-[12%] rounded-2xl bg-white p-3 shadow-xl">
            <b>Kellokoski</b>
            <p className="text-sm text-[#0a55df]">2 {text({ fi: "kotia", en: "homes", sv: "bostäder" })}</p>
          </div>
        </div>
      ) : (
        <div
          className={`mt-8 grid gap-5 ${view === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}
        >
          {filtered.map((a) => (
            <Card
              key={a.id}
              a={a}
              list={view === "list"}
              favorite={favorites.includes(a.id)}
              onFavorite={() => fav(a.id)}
              compared={compare.includes(a.id)}
              onCompare={() => cmp(a.id)}
            />
          ))}
        </div>
      )}
      {compare.length > 0 && (
        <div className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-24px)] max-w-xl -translate-x-1/2 items-center justify-between rounded-full bg-[#102e4e] px-5 py-3 text-white shadow-2xl">
          <span className="text-sm font-bold">
            {text({ fi: "Vertailussa", en: "Comparing", sv: "Jämför" })} {compare.length} / 3
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompare([])}
              aria-label={text({ fi: "Tyhjennä vertailu", en: "Clear comparison", sv: "Rensa jämförelsen" })}
            >
              <X size={18} />
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#102e4e]">
                  {text({ fi: "Vertaa", en: "Compare", sv: "Jämför" })}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl rounded-[28px]">
                <DialogHeader>
                  <DialogTitle className="display text-3xl">
                    {text({ fi: "Vertaa koteja", en: "Compare homes", sv: "Jämför bostäder" })}
                  </DialogTitle>
                </DialogHeader>
                <CompareTable ids={compare} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </section>
  );
}
