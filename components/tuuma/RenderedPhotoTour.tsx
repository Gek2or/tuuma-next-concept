"use client";
/* R3F camera and renderer resources are imperative objects, not React state. */
/* eslint-disable react-hooks/immutability */

import { useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { ArrowUpRight, DoorOpen, Expand, RotateCcw, X } from "lucide-react";
import * as THREE from "three";
import type { PanoramaHome, PanoramaPoint } from "@/lib/panoramas";
import { SceneBoundary, useSceneReady } from "./ApartmentDollhouse";
import { useLanguage } from "./LanguageProvider";

type View = { yaw: number; pitch: number; fov: number };
type LoadState = "loading" | "ready" | "error";
const initialView = (point: PanoramaPoint): View => ({ yaw: point.initialYawRad, pitch: point.initialPitchRad, fov: 78 });

function LookAround({ view, reset, label }: { view: RefObject<View>; reset: number; label: string }) {
  const { camera, gl, invalidate } = useThree();
  useEffect(() => {
    const lens = camera as THREE.PerspectiveCamera;
    const canvas = gl.domElement;
    let pointer: { id: number; x: number; y: number } | null = null;
    const update = () => {
      lens.rotation.set(view.current.pitch, -view.current.yaw, 0, "YXZ");
      lens.fov = view.current.fov;
      lens.updateProjectionMatrix();
      invalidate();
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      canvas.focus({ preventScroll: true });
      canvas.setPointerCapture(event.pointerId);
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    };
    const move = (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      view.current.yaw -= (event.clientX - pointer.x) * .004;
      view.current.pitch = THREE.MathUtils.clamp(view.current.pitch + (event.clientY - pointer.y) * .004, -1.48, 1.48);
      pointer.x = event.clientX; pointer.y = event.clientY;
      update();
    };
    const up = () => { pointer = null; };
    const key = (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "-"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowLeft") view.current.yaw -= .12;
      if (event.key === "ArrowRight") view.current.yaw += .12;
      if (event.key === "ArrowUp") view.current.pitch += .1;
      if (event.key === "ArrowDown") view.current.pitch -= .1;
      if (event.key === "+") view.current.fov -= 5;
      if (event.key === "-") view.current.fov += 5;
      view.current.pitch = THREE.MathUtils.clamp(view.current.pitch, -1.48, 1.48);
      view.current.fov = THREE.MathUtils.clamp(view.current.fov, 45, 100);
      update();
    };
    canvas.tabIndex = 0;
    canvas.setAttribute("aria-label", label);
    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("keydown", key);
    update();
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("keydown", key);
    };
  }, [camera, gl, invalidate, view, reset, label]);
  return null;
}

function PhotoSphere({ point, furnished, onStatus }: { point: PanoramaPoint; furnished: boolean; onStatus: (status: LoadState) => void }) {
  const { gl, invalidate } = useThree();
  const [loaded, setLoaded] = useState<{ url: string; texture: THREE.Texture } | null>(null);
  const images = point.images[furnished ? "furnished" : "empty"];
  const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 640px), (pointer: coarse)").matches;
  const maxSize = gl.capabilities.maxTextureSize;
  const url = maxSize < 4096 ? images.panorama2k : mobile || maxSize < 8192 ? images.panorama4k : images.panorama8k;
  useEffect(() => {
    let current = true;
    let texture: THREE.Texture | undefined;
    onStatus("loading");
    new THREE.TextureLoader().load(url, next => {
      texture = next;
      if (!current) { next.dispose(); return; }
      next.colorSpace = THREE.SRGBColorSpace;
      next.repeat.x = -1;
      next.offset.x = 1;
      next.generateMipmaps = false;
      next.minFilter = THREE.LinearFilter;
      next.magFilter = THREE.LinearFilter;
      setLoaded({ url, texture: next });
      onStatus("ready");
      invalidate();
    }, undefined, () => { if (current) onStatus("error"); });
    return () => { current = false; texture?.dispose(); };
  }, [url, onStatus, invalidate]);
  if (loaded?.url !== url) return null;
  return <mesh rotation={[0, Math.PI / 2, 0]}>
    <sphereGeometry args={[30, 96, 64]} />
    <meshBasicMaterial map={loaded.texture} side={THREE.BackSide} toneMapped={false} />
  </mesh>;
}

export default function RenderedPhotoTour({ home }: { home: PanoramaHome }) {
  const { text } = useLanguage();
  const [room, setRoom] = useState("oh");
  const [furnished, setFurnished] = useState(false);
  const [entered, setEntered] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [reset, setReset] = useState(0);
  const [retry, setRetry] = useState(0);
  const [status, setStatus] = useState<LoadState>("loading");
  const point = home.points.find(item => item.id === room) ?? home.points[0];
  const view = useRef(initialView(point));
  const { ref, ready, unavailable } = useSceneReady();
  const exit = () => { setEntered(false); setExpanded(false); };
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setExpanded(false); };
    document.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", escape); };
  }, [expanded]);
  const fallback = <div className="grid h-full place-items-center p-6 text-center"><div><p>{text({ fi: "360°-näkymä ei ole käytettävissä tässä selaimessa. Huonekuvat löytyvät galleriasta.", en: "360° is unavailable in this browser. Room images are available in the gallery.", sv: "360° är inte tillgängligt i den här webbläsaren. Rumsbilder finns i galleriet." })}</p></div></div>;
  const button = "flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 px-4 text-sm font-semibold";
  return <section data-photo-tour={home.id} data-room={point.id} data-furnished={furnished} role={expanded ? "dialog" : undefined} aria-modal={expanded || undefined} aria-label={`${home.id} · 360°`} onKeyDown={event => {
    if (!expanded || event.key !== "Tab") return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, select, [tabindex="0"]')).filter(element => element.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }} className={`overflow-hidden bg-[#173655] text-white ${expanded ? "fixed inset-0 z-[1000] flex h-[100dvh] flex-col" : "rounded-3xl"}`}>
    <header className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div><p className="text-xs font-bold tracking-[.15em]">360° / {home.id}</p><h3 className="mt-1 text-lg font-semibold">{text(point.labels)}</h3></div>
      <div className="flex flex-wrap gap-2">
        <button className={button} onClick={() => { view.current = initialView(point); setReset(value => value + 1); }} aria-label={text({ fi: "Palauta näkymä", en: "Reset view", sv: "Återställ vyn" })}><RotateCcw size={18} /></button>
        <button className={button} onClick={() => setExpanded(value => !value)} aria-label={text(expanded ? { fi: "Sulje suuri näkymä", en: "Close large view", sv: "Stäng stor vy" } : { fi: "Suuri näkymä", en: "Large view", sv: "Stor vy" })}>{expanded ? <X size={18} /> : <Expand size={18} />}</button>
        {entered && <button className={button} onClick={exit}><DoorOpen size={18} />{text({ fi: "Poistu", en: "Exit", sv: "Gå ut" })}</button>}
      </div>
    </header>
    <div ref={ref} className={`relative bg-[#e8e5df] text-[#173655] ${expanded ? "min-h-0 flex-1" : "h-[min(65svh,620px)] min-h-[340px]"}`}>
      {!entered ? <div className="absolute inset-0 grid place-items-center"><img src={point.images.empty.gallery} className="absolute inset-0 h-full w-full object-cover" alt="" /><button className="relative rounded-full bg-[#173655] px-6 py-4 font-semibold text-white shadow-xl" onClick={() => { setFurnished(false); view.current = initialView(point); setEntered(true); }}>{text({ fi: "Astu asuntoon", en: "Enter apartment", sv: "Gå in i bostaden" })}</button></div> : unavailable ? fallback : <SceneBoundary key={retry} fallback={fallback}>
        {ready && <Canvas frameloop="demand" dpr={[1, 2]} camera={{ position: [0, 0, 0], fov: 78, near: .05, far: 60 }} gl={{ antialias: false }}>
          <PhotoSphere point={point} furnished={furnished} onStatus={setStatus} />
          <LookAround view={view} reset={reset} label={text({ fi: "360°-näkymä. Vedä tai käytä nuolinäppäimiä.", en: "360° view. Drag or use the arrow keys.", sv: "360°-vy. Dra eller använd piltangenterna." })} />
          {status === "ready" && point.hotspots.map((hotspot, index) => {
            const delta = new THREE.Vector3(hotspot.positionM[0] - point.positionM[0], hotspot.positionM[1] - point.positionM[1], hotspot.positionM[2] - point.positionM[2]).normalize().multiplyScalar(10);
            const target = home.points.find(item => item.id === hotspot.targetId);
            const label = target ? text(target.labels) : text({ fi: "Ulos", en: "Outside", sv: "Ut" });
            return <Html key={`${room}-${index}`} position={delta} center zIndexRange={[20, 0]}><button className="flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border-2 border-white bg-[#173655]/95 px-4 py-2 text-sm font-semibold text-white shadow-lg" onPointerDown={event => event.stopPropagation()} onClick={() => { if (target) { setStatus("loading"); setRoom(target.id); } else exit(); }}><ArrowUpRight size={18} />{label}</button></Html>;
          })}
        </Canvas>}
        {status !== "ready" && <div className="absolute inset-0 grid place-items-center bg-[#e8e5df] p-6 text-center"><div role="status"><p>{text(status === "error" ? { fi: "Panoraaman lataus epäonnistui.", en: "The panorama could not load.", sv: "Panoramat kunde inte laddas." } : { fi: "Ladataan panoraamaa…", en: "Loading panorama…", sv: "Laddar panorama…" })}</p>{status === "error" && <button className="mt-4 min-h-11 rounded-full border px-5" onClick={() => { setStatus("loading"); setRetry(value => value + 1); }}>{text({ fi: "Yritä uudelleen", en: "Try again", sv: "Försök igen" })}</button>}</div></div>}
      </SceneBoundary>}
    </div>
    <div className={`space-y-3 p-4 ${expanded ? "max-h-[32dvh] overflow-y-auto" : ""}`}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-full border border-white/30 p-1" role="group" aria-label={text({ fi: "Kalustus", en: "Furnishing", sv: "Möblering" })}>{[false, true].map(value => <button key={String(value)} aria-pressed={value === furnished} onClick={() => { if (value !== furnished) { setStatus("loading"); setFurnished(value); } }} className={`min-h-11 rounded-full px-4 text-sm font-semibold ${value === furnished ? "bg-white text-[#173655]" : ""}`}>{text(value ? { fi: "Kalustettu", en: "Furnished", sv: "Möblerad" } : { fi: "Tyhjä", en: "Empty", sv: "Tom" })}</button>)}</div>
        <label className="flex min-w-0 flex-1 items-center gap-2 text-sm"><span>{text({ fi: "Huone", en: "Room", sv: "Rum" })}</span><select className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/30 bg-[#173655] px-3" value={room} onChange={event => { setStatus("loading"); setRoom(event.target.value); setEntered(true); }} aria-label={text({ fi: "Kierroksen huone", en: "Tour room", sv: "Rundturens rum" })}>{home.points.map(item => <option key={item.id} value={item.id}>{text(item.labels)}{home.points.some(p => p.level > 1) ? ` · ${text({ fi: "taso", en: "level", sv: "plan" })} ${item.level}` : ""}</option>)}</select></label>
      </div>
      <p className="text-xs leading-5 text-white/80">{text({ fi: "Vedä katsoaksesi, nuolinäppäimet kääntävät näkymää. Ovipainikkeet vievät seuraavaan huoneeseen. Tyhjä ja kalustettu näkymä käyttävät samaa tilamallia ja kamerapaikkaa.", en: "Drag to look; arrow keys turn the view. Door buttons move to the next room. Empty and furnished views use the same model and camera position.", sv: "Dra för att se; piltangenterna vrider vyn. Dörrknapparna leder till nästa rum. Tomma och möblerade vyer använder samma modell och kameraposition." })}</p>
      <p className="text-xs leading-5 text-white/65">{text({ fi: "Renderöity 360°-konseptikierros. Ei valokuvia todellisesta vuokrakohteesta. Kalustus, pihanäkymä ja pintasävyt ovat havainnollistavia; kalusteet eivät sisälly vuokraan.", en: "Rendered 360° concept tour. These are not photographs of a real rental home. Furniture, courtyard and finish colours are illustrative; furniture is not included in the rent.", sv: "Renderad 360°-konceptrundtur. Bilderna är inte fotografier av ett verkligt hyresobjekt. Möbler, gård och ytskikt är illustrativa; möbler ingår inte i hyran." })}</p>
    </div>
  </section>;
}
