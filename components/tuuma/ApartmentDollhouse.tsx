"use client";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Environment, Lightformer } from "@react-three/drei";
import { designFor } from "@/lib/architecture";
import { apartments, type Apartment } from "@/lib/data";
import { ArchitecturalModel, type InteriorStyle } from "./ArchitecturalModel";
import * as THREE from "three";
import { PlanGeometry } from "./ApartmentPlan";
import { useLanguage } from "./LanguageProvider";
export class SceneBoundary extends Component<{
    children: ReactNode;
    fallback: ReactNode;
}, {
    failed: boolean;
}> {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
export function useSceneReady() {
    const ref = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false), [unavailable, setUnavailable] = useState(false);
    useEffect(() => { if (!ref.current)
        return; let supported: boolean | undefined; const observer = new IntersectionObserver(entries => { const visible = entries.some(e => e.isIntersecting); if (visible && supported === undefined) {
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2");
        supported = !!gl;
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
        if (!supported)
            setUnavailable(true);
    } setReady(visible && !!supported); }, { rootMargin: "200px" }); observer.observe(ref.current); return () => observer.disconnect(); }, []);
    return { ref, ready, unavailable };
}
export function useSceneQuality() {
    const [compact, setCompact] = useState(false);
    useEffect(() => {
        const query = window.matchMedia("(max-width: 640px), (pointer: coarse)");
        const update = () => setCompact(query.matches);
        update();
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);
    return compact;
}
/** Small local reflection environment; no external HDR network request. */
export function StudioEnvironment() {
    return <Environment resolution={128} frames={1}>
      <Lightformer form="rect" intensity={2} color="#fff4df" position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 10, 1]}/>
      <Lightformer form="rect" intensity={3} color="#dbe9ff" position={[-8, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[5, 5, 1]}/>
      <Lightformer form="rect" intensity={1} color="#ffe8c9" position={[8, 2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[4, 5, 1]}/>
    </Environment>;
}
export function ModelFallback({ apartment }: {
    apartment: Apartment;
}) { const d = designFor(apartment.id); const { text } = useLanguage(); const f20 = !!apartment.showcaseReady; return <div className="grid h-full min-h-80 place-items-center bg-[#f0f2ef] p-4 sm:p-6">{f20 ? <div className="max-w-5xl overflow-hidden rounded-2xl bg-white shadow-[0_16px_35px_rgba(18,49,76,.16)]"><img src={apartment.emptyImage ?? apartment.image} alt={text({ fi: `${apartment.id}: konseptikuva`, en: `${apartment.id}: concept image`, sv: `${apartment.id}: konceptbild` })} className="aspect-[3/2] w-full object-cover" /><div className="p-4 text-center text-sm leading-6 text-[#465f72]"><b className="text-[#173655]">{text({ fi: `${apartment.id} · konseptivisualisointi`, en: `${apartment.id} · concept visualization`, sv: `${apartment.id} · konceptvisualisering` })}</b><span className="block">{text({ fi: "WebGL ei ole käytettävissä tällä laitteella. Valitse Pohja-välilehti nähdäksesi piirustuksen. 3D avautuu tuetulla selaimella.", en: "WebGL is unavailable on this device. Choose the Plan tab to see the drawing. 3D opens in a supported browser.", sv: "WebGL är inte tillgängligt på den här enheten. Välj Planritning för att se ritningen. 3D öppnas i en webbläsare som stöds." })}</span></div></div> : <><svg viewBox={`-500 -2300 ${d.width + 1000} ${d.depth + 3000}`} className="max-h-80 w-full" aria-label={`${apartment.id} floor plan`}><PlanGeometry design={d}/></svg><p className="mt-4 text-center text-sm text-[#465f72]">{text({ fi: "3D edellyttää WebGL-tukea. Tarkka pohjapiirustus on käytettävissä alla.", en: "3D requires WebGL. The vector floor plan remains available below.", sv: "3D kräver WebGL. Vektorplanen är tillgänglig nedan." })}</p></>}</div>; }
export function InteriorOptions({ style, setStyle, furnished, setFurnished }: {
    style: InteriorStyle;
    setStyle: (s: InteriorStyle) => void;
    furnished: boolean;
    setFurnished: (b: boolean) => void;
}) {
    const { text } = useLanguage();
    return <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto"><div className="grid flex-1 grid-cols-2 rounded-full border bg-white p-1 text-[#173655] sm:flex-none">{[true, false].map(value => <button key={String(value)} onClick={() => setFurnished(value)} aria-pressed={value === furnished} className={`min-h-11 rounded-full px-3 text-sm font-semibold sm:px-4 ${value === furnished ? "bg-[#173655] text-white" : ""}`}>{value ? text({ fi: "Kalustettu", en: "Furnished", sv: "Möblerad" }) : text({ fi: "Tyhjä", en: "Empty", sv: "Tom" })}</button>)}</div><label className="flex w-full items-center gap-2 text-sm sm:w-auto"><span className="shrink-0">{text({ fi: "Sisustus", en: "Interior", sv: "Inredning" })}</span><select aria-label={text({ fi: "Sisustustyyli", en: "Interior style", sv: "Inredningsstil" })} value={style} onChange={e => setStyle(e.target.value as InteriorStyle)} className="min-h-11 min-w-0 flex-1 rounded-full border bg-white px-4 text-[#173655] sm:flex-none"><option value="nordic">Nordic · {text({ fi: "tammi", en: "oak", sv: "ek" })}</option><option value="clay">Clay · {text({ fi: "savi", en: "clay", sv: "lera" })}</option><option value="forest">Forest · {text({ fi: "metsä", en: "forest", sv: "skog" })}</option></select></label></div>;
}
export default function ApartmentDollhouse({ apartment = apartments[0] }: {
    apartment?: Apartment;
}) {
    const { text } = useLanguage();
    const design = designFor(apartment.id);
    const [style, setStyle] = useState<InteriorStyle>(apartment.id === "F20" || apartment.variant === "ruukinranta" ? "forest" : apartment.id === "E15" || apartment.variant === "asemanvalo" ? "clay" : "nordic"), [furnished, setFurnished] = useState(true), [cutaway, setCutaway] = useState(true), [level, setLevel] = useState(1);
    const { ref, ready, unavailable } = useSceneReady();
    const compactScene = useSceneQuality();
    const w = design.width / 1000, d = design.depth / 1000, extent = Math.max(w, d);
    return <section className="overflow-hidden rounded-3xl border bg-[#f1f2ed] text-[#173655]"><header className="flex flex-wrap justify-between gap-4 bg-white p-4 sm:gap-5 sm:p-7"><div><p className="text-xs font-bold tracking-[.18em] text-slate-500">3D / {apartment.id} / {design.name}</p><h2 className="mt-2 text-xl font-semibold sm:text-2xl">{text({ fi: "Tila, jonka voit hahmottaa.", en: "Get a feel for the space.", sv: "Få en känsla för rummet." })}</h2></div><InteriorOptions style={style} setStyle={setStyle} furnished={furnished} setFurnished={setFurnished}/></header>
    {design.levels > 1 && <div className="flex gap-2 bg-white px-5 pb-4" aria-label={text({ fi: "Mallin taso", en: "Model level", sv: "Modellens våning" })}>{Array.from({length: design.levels}, (_, i) => <button key={i} aria-pressed={level === i + 1} onClick={() => setLevel(i + 1)} className={`min-h-11 rounded-full px-5 text-sm font-bold ${level === i + 1 ? "bg-[#3d4785] text-white" : "border text-[#22264b]"}`}>{text({fi: "Taso", en: "Level", sv: "Våning"})} {i + 1}</button>)}</div>}
    <div ref={ref} className="relative h-[min(58svh,430px)] min-h-[340px] sm:h-[660px]" role="group" aria-label={`${apartment.id} 3D`}>{unavailable && <ModelFallback apartment={apartment}/>}<SceneBoundary fallback={<ModelFallback apartment={apartment}/>}>
      {ready && <Canvas shadows dpr={compactScene ? [1, 1.25] : [1, 1.75]} camera={{ position: [w / 2 + extent * .82, extent * 1.1, d / 2 + extent * .92], fov: 42, near: .1, far: 120 }} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.shadowMap.type = THREE.PCFSoftShadowMap; gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.08; }}><color attach="background" args={["#e7ebe7"]}/><hemisphereLight args={["#f5f8ff", "#b6ad96", 2.2]}/><directionalLight position={[-5, 12, -7]} intensity={3} castShadow shadow-mapSize={compactScene ? [1024, 1024] : [2048, 2048]} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15} shadow-bias={-.0004}/><ArchitecturalModel design={design} style={style} furnished={furnished} cutaway={cutaway} level={level}/><StudioEnvironment/><ContactShadows position={[w / 2, -.24, d / 2]} scale={extent * 2} opacity={.38} blur={2} far={4} frames={1}/><OrbitControls makeDefault target={[w / 2, (level - 1) * 2.82, d / 2]} minDistance={6} maxDistance={30} minPolarAngle={.05} maxPolarAngle={Math.PI / 2.15} enableDamping/></Canvas>}
    </SceneBoundary><div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-end justify-between gap-2 sm:bottom-5 sm:left-5 sm:right-5 sm:gap-3"><span className="rounded-full bg-white/95 px-3 py-2 text-xs shadow-sm sm:px-4 sm:text-sm">{text({ fi: "Vedä · pyöritä / nipistä · zoomaa", en: "Drag · orbit / pinch · zoom", sv: "Dra · rotera / nyp · zooma" })}</span><button aria-pressed={cutaway} onClick={() => setCutaway(!cutaway)} className="min-h-11 rounded-full bg-[#173655] px-4 text-sm font-semibold text-white">{cutaway ? text({ fi: "Täydet seinät", en: "Full walls", sv: "Hela väggar" }) : text({ fi: "Avaa leikkaus", en: "Cutaway view", sv: "Öppna genomskärning" })}</button></div></div>
    <p className="border-t bg-white px-6 py-4 text-sm leading-6 text-slate-500">{text({ fi: "Mallin seinät, aukot ja kiintokalusteet vastaavat yllä olevaa piirustusta. Kaikki kodit käyttävät samaa luonnollista tammi- ja posliinilaattojen materiaalikirjastoa; tyhjässä tilassa keittiö, säilytys ja märkätilojen varusteet säilyvät.", en: "Walls, openings and fixed fittings match the drawing above. Every home uses the same natural oak and porcelain-tile material library; empty mode retains the kitchen, storage and bathroom fixtures.", sv: "Väggar, öppningar och fast inredning motsvarar ritningen ovan. Alla hem använder samma materialbibliotek med naturlig ek och porslinskakel; tomt läge behåller kök, förvaring och badrumsutrustning." })}</p>
  </section>;
}
