"use client";

import { useState } from "react";
import { Expand, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Apartment, RoomMedia } from "@/lib/data";
import { panoramaFor } from "@/lib/panoramas";
import { useLanguage } from "./LanguageProvider";

const copy = {
  empty: { fi: "Tyhjä", en: "Empty", sv: "Tom" },
  furnished: { fi: "Kalustettu", en: "Furnished", sv: "Möblerad" },
  compare: { fi: "Vertaa", en: "Compare", sv: "Jämför" },
  enlarge: { fi: "Avaa suuri kuva", en: "Enlarge image", sv: "Öppna stor bild" },
  close: { fi: "Sulje", en: "Close", sv: "Stäng" },
  room: { fi: "Valitse huone", en: "Choose a room", sv: "Välj rum" },
  slider: { fi: "Tyhjän ja kalustetun kuvan raja", en: "Empty and furnished image divider", sv: "Gräns mellan tom och möblerad bild" },
  note: { fi: "Konseptikuvia. Kalustus on lisätty saman huoneen tyhjään lähtökuvaan. Kalusteet eivät sisälly vuokraan.", en: "Concept renders. Furniture was added to the same room’s empty reference image. Furniture is not included in the rent.", sv: "Konceptbilder. Möbler har lagts till i samma rums tomma referensbild. Möbler ingår inte i hyran." },
  renderNote: { fi: "Sisustuksen konseptikuva. Tarkista tilajako pohjapiirustuksesta ja 3D-mallista. Kalusteet eivät sisälly vuokraan.", en: "Interior concept image. Refer to the plan and 3D model for the room layout. Furniture is not included in the rent.", sv: "Konceptbild av inredningen. Se plan och 3D-modell för rumsindelningen. Möbler ingår inte i hyran." },
  sceneNote: { fi: "Saman 360°-tilamallin kuvanäkymät: sama kamera, pinnat ja valaistus molemmissa vaihtoehdoissa. Renderöityjä konseptikuvia, eivät kohteen valokuvia. Kiinteät varusteet säilyvät tyhjässä asunnossa; kalusteet eivät sisälly vuokraan.", en: "Views from the same 360° model: matching camera, finishes and lighting in both variants. Rendered concept images, not property photographs. Fixed fittings remain in the empty home; furniture is not included in the rent.", sv: "Vyer från samma 360°-modell: samma kamera, ytskikt och belysning i båda alternativen. Renderade konceptbilder, inte objektets fotografier. Fast inredning finns kvar i den tomma bostaden; möbler ingår inte i hyran." },
  fixtures: { fi: "Kiinteät varusteet säilyvät myös tyhjässä asunnossa.", en: "Fixed fittings remain in the empty apartment.", sv: "Fast inredning finns kvar i den tomma bostaden." },
};

export function ApartmentGallery({ apartment }: { apartment: Apartment }) {
  const { text } = useLanguage();
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"empty" | "furnished" | "compare">("empty");
  const [split, setSplit] = useState(50);
  const rendered = panoramaFor(apartment.id);
  const renderedRooms: RoomMedia[] = rendered?.points.every(point => point.status === "ready")
    ? rendered.points.map(point => ({ id: point.id, label: point.labels, empty: point.images.empty.gallery, furnished: point.images.furnished.gallery, thumbnail: point.images.empty.thumbnail, source: "scene-render" }))
    : [];
  const originalRooms = apartment.roomMedia ?? [];
  const hasOriginalLivingPair = originalRooms.some(item => item.id === "living" && item.furnished);
  const addedRooms = renderedRooms.filter(item => !(item.id === "oh" && hasOriginalLivingPair));
  const rooms = addedRooms.length ? [...originalRooms, ...addedRooms] : apartment.roomMedia;
  const room = rooms?.[index] ?? rooms?.[0];
  const legacyImages = [...new Set([apartment.emptyImage, ...(apartment.gallery ?? [apartment.image])].filter(Boolean))] as string[];
  const effectiveMode = room?.furnished ? mode : room?.state ?? "empty";
  const source = room ? (room.furnished && effectiveMode === "furnished" ? room.furnished : room.empty) : legacyImages[index] ?? legacyImages[0];
  const label = room ? text(room.label) : `${apartment.id} · ${index + 1}`;
  const note = room?.source === "scene-render" ? copy.sceneNote : room?.source === "concept-render" ? copy.renderNote : copy.note;

  const controls = (large = false) => <div className="flex flex-wrap items-center justify-between gap-3">
    {room?.furnished ? <div className="grid w-full grid-cols-3 gap-1 rounded-2xl bg-[#edf1ef] p-1 sm:w-auto sm:flex" role="group" aria-label={text({ fi: "Kalustus", en: "Furnishing", sv: "Möblering" })}>
      {(["empty", "furnished", "compare"] as const).map(value => <button key={value} type="button" aria-pressed={effectiveMode === value} onClick={() => setMode(value)} className={`min-h-11 rounded-xl px-2 text-sm font-bold sm:px-4 ${effectiveMode === value ? "bg-[#173655] text-white" : "text-[#36516a]"}`}>{text(copy[value])}</button>)}
    </div> : <p className="text-sm text-[#526878]">{room?.state === "furnished" ? text({fi:"Sisustusidea · konseptikuva",en:"Interior idea · concept image",sv:"Inredningsidé · konceptbild"}) : room?.id === "exterior" ? text({fi:"Julkisivun konseptikuva",en:"Exterior concept image",sv:"Konceptbild av fasaden"}) : room ? text(copy.fixtures) : text({ fi: "Erillisiä konseptikuvia", en: "Individual concept images", sv: "Separata konceptbilder" })}</p>}
    {!large && <DialogTrigger asChild><button className="flex min-h-11 items-center gap-2 rounded-xl border border-[#ccd6d9] px-4 text-sm font-bold text-[#173655]"><Expand size={17} />{text(copy.enlarge)}</button></DialogTrigger>}
  </div>;

  const picture = (large = false) => <div className={`relative overflow-hidden bg-[#e9e7e1] ${large ? "rounded-none sm:rounded-xl" : "rounded-[24px]"}`}>
    <div className={`relative ${large ? "mx-auto aspect-[3/2] max-h-[58svh] sm:max-h-[65vh]" : "aspect-[3/2]"}`} style={{ touchAction: effectiveMode === "compare" ? "pan-y" : "auto" }} onPointerDown={event => {
      if (effectiveMode !== "compare") return;
      event.currentTarget.setPointerCapture(event.pointerId);
      const rect = event.currentTarget.getBoundingClientRect();
      setSplit(Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)));
    }} onPointerMove={event => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setSplit(Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)));
    }} onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }} onDragStart={event => event.preventDefault()}>
      <img src={source} alt={`${apartment.id} · ${label} · ${room ? text(copy[effectiveMode === "furnished" ? "furnished" : "empty"]) : "Concept"}`} className="absolute inset-0 h-full w-full object-contain" decoding="async" />
      {effectiveMode === "compare" && room?.furnished && <>
        <img src={room.furnished} alt={`${label} · ${text(copy.furnished)}`} className="absolute inset-0 h-full w-full object-contain" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }} decoding="async" />
        <div className="pointer-events-none absolute inset-y-0 w-[2px] bg-white shadow" style={{ left: `${split}%` }}><span className="absolute top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-[#173655] text-lg text-white">↔</span></div>
        <div className="pointer-events-none absolute inset-x-3 top-3 flex justify-between gap-2 text-xs font-semibold"><span className="rounded-full bg-[#173655]/95 px-3 py-2 text-white">{text(copy.furnished)}</span><span className="rounded-full bg-white/95 px-3 py-2 text-[#173655]">{text(copy.empty)}</span></div>
      </>}
    </div>
    {effectiveMode === "compare" && <label className="flex items-center gap-2 bg-white px-3 py-3 text-sm text-[#173655] sm:gap-3 sm:px-4"><span className="sr-only">{text(copy.slider)}</span><span aria-hidden="true" className="text-xs sm:text-sm">{text(copy.empty)}</span><input type="range" min="0" max="100" value={split} onChange={e => setSplit(Number(e.target.value))} className="h-11 min-w-0 flex-1 accent-[#173655]" aria-label={text(copy.slider)} /><span aria-hidden="true" className="text-xs sm:text-sm">{text(copy.furnished)}</span></label>}
  </div>;

  return <Dialog><div className="space-y-4" data-apartment-gallery={apartment.id}>
    <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-xl font-semibold text-[#173655]" aria-live="polite">{label}</h3><span className="text-xs font-bold tracking-wider text-[#647786]">CONCEPT / {apartment.id}</span></div>
    {picture()}
    {controls()}
    <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3" aria-label={text(copy.room)}>
      {(rooms ?? legacyImages.map((src, i) => ({ id: String(i), empty: src, label: { fi: `Kuva ${i + 1}`, en: `Image ${i + 1}`, sv: `Bild ${i + 1}` } }))).map((item, i) => <button key={item.id} onClick={() => { setIndex(i); setSplit(50); }} aria-pressed={index === i} className={`overflow-hidden rounded-xl border-2 text-left ${index === i ? "border-[#0b58a8] bg-[#edf5fb]" : "border-transparent bg-[#f1f3f0]"}`}><img src={"thumbnail" in item && typeof item.thumbnail === "string" ? item.thumbnail : item.empty} alt="" className="aspect-[3/2] w-full object-cover" loading="lazy" /><span className="block min-h-11 px-3 py-3 text-sm font-semibold text-[#173655]">{text(item.label)}</span></button>)}
    </nav>
    <p className="text-sm leading-6 text-[#617381]">{rooms ? text(note) : text({ fi: "Kuvat ovat visualisointeja, eivät valokuvia todellisesta vuokrakohteesta.", en: "These are visualisations, not photographs of a real rental home.", sv: "Bilderna är visualiseringar, inte fotografier av ett verkligt hyresobjekt." })}</p>
  </div>
  <DialogContent className="inset-0 left-0 top-0 h-[100dvh] max-h-none w-full max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none bg-[#fffdf8] p-3 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[96dvh] sm:max-w-[1200px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:p-6" showCloseButton={false}>
    <div className="sticky top-0 z-10 -mx-3 flex items-center justify-between gap-3 border-b border-[#e3e8e6] bg-[#fffdf8]/95 px-3 pb-3 pt-[max(0.25rem,env(safe-area-inset-top))] backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0"><DialogTitle className="text-lg font-semibold">{apartment.id} · {label}</DialogTitle><DialogClose className="flex min-h-11 items-center gap-2 rounded-full border bg-white px-4 text-sm"><X size={18} /><span className="hidden sm:inline">{text(copy.close)}</span></DialogClose></div>
    <DialogDescription className="sr-only">{text(note)}</DialogDescription>
    {picture(true)}{controls(true)}
  </DialogContent></Dialog>;
}
