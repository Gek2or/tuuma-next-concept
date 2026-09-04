"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Heart,
  Map,
  MapPin,
  Rows3,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { apartments, Apartment } from "@/lib/data";
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
  { k: "pets", l: "Lemmikit" },
  { k: "accessible", l: "Esteetön" },
  { k: "parking", l: "Autopaikka" },
  { k: "ev", l: "EV-lataus" },
  { k: "sauna", l: "Sauna" },
  { k: "balcony", l: "Parveke" },
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
  return (
    <article
      className={`group overflow-hidden rounded-[26px] border border-[#dce6ee] bg-white ${list ? "sm:grid sm:grid-cols-[240px_1fr]" : ""}`}
    >
      <div
        className={`relative overflow-hidden ${list ? "h-56 sm:h-full" : "h-60"}`}
      >
        <img
          src={a.image}
          alt={`${a.title}, asunnon sisäkuva`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs font-bold">
          {a.available}
        </span>
        <button
          onClick={onFavorite}
          className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full ${favorite ? "bg-[#0a55df] text-white" : "bg-white text-[#173b60]"}`}
          aria-label={favorite ? "Poista suosikeista" : "Lisää suosikkeihin"}
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
            Vertaa
          </button>
          <Link
            href="/kohteet/kalliolinna"
            className="flex items-center gap-2 text-sm font-black text-[#0a55df]"
          >
            Tutustu <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
function CompareTable({ ids }: { ids: string[] }) {
  const list = apartments.filter((a) => ids.includes(a.id));
  const rows: Array<[string, (a: Apartment) => React.ReactNode]> = [
    ["Vuokra", (a) => `${a.rent} €/kk`],
    ["Pinta-ala", (a) => `${a.size} m²`],
    ["Huoneet", (a) => `${a.rooms}h`],
    ["Alue", (a) => a.area],
    ["Parveke", (a) => (a.balcony ? "Kyllä" : "—")],
    ["Sauna", (a) => (a.sauna ? "Kyllä" : "—")],
    ["EV-lataus", (a) => (a.ev ? "Kyllä" : "—")],
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr>
            <th className="p-3 text-sm text-[#63778d]">Ominaisuus</th>
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
  const [area, setArea] = useState("Kaikki alueet");
  const [rooms, setRooms] = useState("Kaikki huoneet");
  const [maxRent, setMaxRent] = useState("1200");
  const [checked, setChecked] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "list" | "map">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [mobileFilters, setMobileFilters] = useState(false);
  useEffect(
    () =>
      setFavorites(JSON.parse(localStorage.getItem("tuuma-favorites") || "[]")),
    [],
  );
  const filtered = useMemo(
    () =>
      apartments.filter(
        (a) =>
          (area === "Kaikki alueet" || a.area === area) &&
          (rooms === "Kaikki huoneet" || a.rooms === Number(rooms)) &&
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
  const Filters = () => (
    <div className="grid gap-4 lg:grid-cols-4">
      <label className="grid gap-2 text-sm font-bold">
        Alue
        <NativeSelect
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="h-12 w-full rounded-xl bg-white"
        >
          <NativeSelectOption>Kaikki alueet</NativeSelectOption>
          <NativeSelectOption>Hyrylä</NativeSelectOption>
          <NativeSelectOption>Jokela</NativeSelectOption>
          <NativeSelectOption>Kellokoski</NativeSelectOption>
        </NativeSelect>
      </label>
      <label className="grid gap-2 text-sm font-bold">
        Huoneet
        <NativeSelect
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          className="h-12 w-full rounded-xl bg-white"
        >
          <NativeSelectOption>Kaikki huoneet</NativeSelectOption>
          {[1, 2, 3, 4].map((n) => (
            <NativeSelectOption key={n} value={n}>
              {n} huonetta
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </label>
      <label className="grid gap-2 text-sm font-bold">
        Vuokra enintään
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
        <span className="text-sm font-bold">Ominaisuudet</span>
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
              {f.l}
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
            {f.l}
          </label>
        ))}
      </div>
    </div>
  );
  return (
    <section className="shell py-10 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Vapaat kodit</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">Löydä oma koti</h1>
          <p className="mt-4 text-[#61778d]">
            {filtered.length} kotia vastaa valintojasi
          </p>
        </div>
        <div
          className="flex rounded-full bg-white p-1 shadow-sm"
          role="group"
          aria-label="Näkymä"
        >
          {(
            [
              { k: "grid", i: MapPin, l: "Ruudukko" },
              { k: "list", i: Rows3, l: "Lista" },
              { k: "map", i: Map, l: "Kartta" },
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
          Suodattimet
        </span>
        <span>{mobileFilters ? "Sulje" : "Avaa"}</span>
      </button>
      <div
        className={`${mobileFilters ? "block" : "hidden"} mt-5 rounded-[26px] bg-[#e8f1fa] p-5 lg:block lg:p-7`}
      >
        <Filters />
      </div>
      {view === "map" ? (
        <div className="relative mt-8 h-[600px] overflow-hidden rounded-[32px] bg-[#dbe8ef] soft-grid">
          <div className="absolute inset-0 opacity-45 [background:radial-gradient(ellipse_at_30%_20%,#fff_0_4%,transparent_5%),linear-gradient(35deg,transparent_46%,#fff_47%_50%,transparent_51%),linear-gradient(-25deg,transparent_48%,#fff_49%_52%,transparent_53%)]" />
          <div className="absolute left-[14%] top-[22%] rounded-2xl bg-white p-3 shadow-xl">
            <b>Hyrylä</b>
            <p className="text-sm text-[#0a55df]">2 kotia</p>
          </div>
          <div className="absolute left-[58%] top-[40%] rounded-2xl bg-white p-3 shadow-xl">
            <b>Jokela</b>
            <p className="text-sm text-[#0a55df]">2 kotia</p>
          </div>
          <div className="absolute bottom-[17%] right-[12%] rounded-2xl bg-white p-3 shadow-xl">
            <b>Kellokoski</b>
            <p className="text-sm text-[#0a55df]">2 kotia</p>
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
            Vertailussa {compare.length} / 3
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompare([])}
              aria-label="Tyhjennä vertailu"
            >
              <X size={18} />
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#102e4e]">
                  Vertaa
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl rounded-[28px]">
                <DialogHeader>
                  <DialogTitle className="display text-3xl">
                    Vertaa koteja
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
