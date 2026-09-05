"use client";
/* R3F exposes imperative camera/renderer resources, not React state. Updated only in effects. */
/* eslint-disable react-hooks/immutability */
import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Expand, Map, RotateCcw } from "lucide-react";
import * as THREE from "three";
import { designFor, roomNames, type Design } from "@/lib/architecture";
import { apartments, type Apartment } from "@/lib/data";
import { ArchitecturalModel, type InteriorStyle } from "./ArchitecturalModel";
import { InteriorOptions, ModelFallback, SceneBoundary, useSceneReady } from "./ApartmentDollhouse";
import { PlanGeometry } from "./ApartmentPlan";
import { useLanguage } from "./LanguageProvider";
export function cameraSpot(design: Design, id: string): [
    number,
    number,
    number
] {
    const room = design.rooms.find(r => r.id === id)!;
    const options = [.5, .65, .35, .8, .2].flatMap(x => [.5, .7, .3, .85].map(z => ({ x: room.x + room.w * x, z: room.z + room.d * z })));
    const spot = options.find(p => !design.fittings.some(f => f.room === id && f.kind !== "rug" && p.x > f.x - 200 && p.x < f.x + f.w + 200 && p.z > f.z - 200 && p.z < f.z + f.d + 200)) ?? options[0];
    return [spot.x / 1000, 1.6, spot.z / 1000];
}
function LookControls({ design, room, reset }: {
    design: Design;
    room: string;
    reset: number;
}) {
    const { camera, gl, invalidate } = useThree();
    useEffect(() => {
        const perspective = camera as THREE.PerspectiveCamera;
        const spot = cameraSpot(design, room);
        camera.position.set(...spot);
        const r = design.rooms.find(r => r.id === room)!;
        camera.lookAt((r.x + r.w * .5) / 1000, 1.25, (r.z + 250) / 1000);
        const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
        const canvas = gl.domElement;
        canvas.style.touchAction = "none";
        canvas.tabIndex = 0;
        canvas.setAttribute("aria-label", "360° · drag / arrow keys / WASD");
        let dragging = false, lastX = 0, lastY = 0;
        const update = () => { euler.x = THREE.MathUtils.clamp(euler.x, -1.25, 1.25); camera.quaternion.setFromEuler(euler); invalidate(); };
        const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); canvas.focus(); };
        const move = (e: PointerEvent) => { if (!dragging)
            return; euler.y -= (e.clientX - lastX) * .004; euler.x -= (e.clientY - lastY) * .004; lastX = e.clientX; lastY = e.clientY; update(); };
        const up = () => { dragging = false; };
        const moveInsideRoom = (forward: number, side: number) => {
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            direction.y = 0;
            direction.normalize();
            const sideways = new THREE.Vector3(direction.z, 0, -direction.x);
            const next = camera.position.clone().addScaledVector(direction, forward).addScaledVector(sideways, side);
            const clearance = .38;
            next.x = THREE.MathUtils.clamp(next.x, r.x / 1000 + clearance, (r.x + r.w) / 1000 - clearance);
            next.z = THREE.MathUtils.clamp(next.z, r.z / 1000 + clearance, (r.z + r.d) / 1000 - clearance);
            const occupied = design.fittings.some(f => f.room === room && f.kind !== "rug" && next.x > (f.x - 130) / 1000 && next.x < (f.x + f.w + 130) / 1000 && next.z > (f.z - 130) / 1000 && next.z < (f.z + f.d + 130) / 1000);
            if (!occupied)
                camera.position.copy(next);
            invalidate();
        };
        const key = (e: KeyboardEvent) => {
            const lookKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
            const walk: Record<string, [number, number]> = { w: [.28, 0], W: [.28, 0], s: [-.28, 0], S: [-.28, 0], a: [0, -.28], A: [0, -.28], d: [0, .28], D: [0, .28] };
            if (lookKeys.includes(e.key)) {
                e.preventDefault();
                euler.y += e.key === "ArrowLeft" ? .1 : e.key === "ArrowRight" ? -.1 : 0;
                euler.x += e.key === "ArrowUp" ? .1 : e.key === "ArrowDown" ? -.1 : 0;
                update();
            }
            else if (walk[e.key]) {
                e.preventDefault();
                moveInsideRoom(...walk[e.key]);
            }
        };
        const wheel = (e: WheelEvent) => { if (!e.ctrlKey)
            return; e.preventDefault(); perspective.fov = THREE.MathUtils.clamp(perspective.fov + e.deltaY * .025, 40, 90); perspective.updateProjectionMatrix(); invalidate(); };
        canvas.addEventListener("pointerdown", down);
        canvas.addEventListener("pointermove", move);
        canvas.addEventListener("pointerup", up);
        canvas.addEventListener("pointercancel", up);
        canvas.addEventListener("keydown", key);
        canvas.addEventListener("wheel", wheel, { passive: false });
        invalidate();
        return () => { canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up); canvas.removeEventListener("keydown", key); canvas.removeEventListener("wheel", wheel); };
    }, [camera, gl, design, room, reset, invalidate]);
    return null;
}
function Portals({ design, room, select }: {
    design: Design;
    room: string;
    select: (id: string) => void;
}) {
    const { text } = useLanguage();
    return <>{design.walls.filter(w => w.opening && w.opening.kind !== "window" && w.rooms.length === 2 && w.rooms.includes(room)).map(w => { const target = design.rooms.find(r => r.id === w.rooms.find(id => id !== room))!; const middle = (w.opening!.start + w.opening!.width / 2) / 1000; return <Html key={w.id} position={w.axis === "x" ? [middle, 1.2, w.at / 1000] : [w.at / 1000, 1.2, middle]} center zIndexRange={[10, 0]}><button onClick={() => select(target.id)} className="flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border-2 border-white bg-[#173655]/95 px-4 text-sm font-semibold text-white shadow-xl">{target.code} · {text(roomNames[target.kind])} →</button></Html>; })}</>;
}
export default function Tour360Viewer({ apartment = apartments[0] }: {
    apartment?: Apartment;
}) {
    const { text } = useLanguage();
    const design = designFor(apartment.id);
    const [room, setRoom] = useState("oh"), [style, setStyle] = useState<InteriorStyle>("nordic"), [furnished, setFurnished] = useState(true), [minimap, setMinimap] = useState(false), [reset, setReset] = useState(0), [notice, setNotice] = useState("");
    const { ref, ready, unavailable } = useSceneReady();
    const container = useRef<HTMLElement>(null);
    const active = design.rooms.find(r => r.id === room)!;
    const clearSize = `${(active.w / 1000).toFixed(1).replace(".", ",")} × ${(active.d / 1000).toFixed(1).replace(".", ",")} m`;
    const finish = active.kind === "bathroom"
        ? { fi: "Matta posliinilaatta", en: "Matte porcelain tile", sv: "Matt porslinskakel" }
        : active.kind === "sauna"
            ? { fi: "Puuverhoiltu sauna", en: "Wood-lined sauna", sv: "Träklädd bastu" }
            : { fi: "Vaalea tammilattia", en: "Light oak floor", sv: "Ljust ekgolv" };
    async function fullscreen() { try {
        if (document.fullscreenElement)
            await document.exitFullscreen();
        else if (container.current?.requestFullscreen)
            await container.current.requestFullscreen();
        else
            setNotice(text({ fi: "Koko näyttö ei ole käytettävissä tässä selaimessa.", en: "Fullscreen is unavailable in this browser.", sv: "Helskärm är inte tillgängligt i denna webbläsare." }));
    }
    catch {
        setNotice(text({ fi: "Selain ei sallinut koko näytön tilaa.", en: "The browser did not allow fullscreen.", sv: "Webbläsaren tillät inte helskärm." }));
    } }
    return <section ref={container} className="architecture-tour overflow-hidden rounded-3xl border border-white/20 bg-[#173655] text-white"><header className="flex flex-wrap justify-between gap-4 p-5"><div><p className="text-xs font-bold tracking-[.17em] text-white/60">LIVE 3D / {apartment.id} / CONCEPT</p><h3 className="mt-1 text-xl font-semibold">{active.code} · {text(roomNames[active.kind])}</h3></div><div className="flex gap-2"><button onClick={() => setMinimap(!minimap)} aria-pressed={minimap} aria-label={text({ fi: "Pohjakartta", en: "Floor map", sv: "Plankarta" })} className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><Map size={20}/></button><button onClick={() => setReset(reset + 1)} aria-label={text({ fi: "Palauta näkymä", en: "Reset view", sv: "Återställ vy" })} className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><RotateCcw size={18}/></button><button onClick={() => void fullscreen()} aria-label={text({ fi: "Koko näyttö", en: "Fullscreen", sv: "Helskärm" })} className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><Expand size={20}/></button></div></header>
    <div ref={ref} className="tour-viewport relative h-[460px] bg-[#e1e7e5] sm:h-[650px]">{unavailable && <ModelFallback apartment={apartment}/>}<SceneBoundary fallback={<ModelFallback apartment={apartment}/>}>
      {ready && <Canvas shadows dpr={[1, 1.75]} camera={{ position: cameraSpot(design, "oh"), fov: 72, near: .03, far: 120 }} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.shadowMap.type = THREE.PCFSoftShadowMap; gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.08; }}><color attach="background" args={["#c6dce4"]}/><hemisphereLight args={["#f3f6ff", "#b9aa8f", 2.5]}/><directionalLight position={[-8, 14, -10]} intensity={3.2} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={18} shadow-camera-bottom={-18} shadow-bias={-.0003}/><ArchitecturalModel design={design} style={style} furnished={furnished} interior/><mesh position={[design.width / 2000, -.3, design.depth / 2000]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[160, 160]}/><meshStandardMaterial color="#96a788" roughness={1}/></mesh><LookControls design={design} room={room} reset={reset}/><Portals design={design} room={room} select={setRoom}/></Canvas>}
    </SceneBoundary>{minimap && <div className="absolute right-3 top-3 w-52 max-w-[60%] rounded-2xl border bg-white/95 p-3 shadow-lg"><svg viewBox={`-400 -2100 ${design.width + 800} ${design.depth + 2800}`} aria-label={text({ fi: "Pohjakartta", en: "Floor map", sv: "Plankarta" })}><PlanGeometry design={design} active={room} select={setRoom} furnished={false}/></svg></div>}<div className="pointer-events-none absolute bottom-4 left-4 max-w-[calc(100%-2rem)] rounded-2xl bg-[#173655]/86 px-4 py-3 text-sm shadow-lg backdrop-blur"><b className="block text-white">{clearSize} · {text(finish)}</b><span className="mt-1 block text-xs text-white/72">{text({ fi: "Vedä katsoaksesi · W A S D liikkuu huoneessa", en: "Drag to look · W A S D moves inside the room", sv: "Dra för att se · W A S D rör sig i rummet" })}</span></div></div>
    <div className="space-y-4 p-5"><nav className="flex gap-2 overflow-x-auto pb-2" aria-label={text({ fi: "Kierroksen huoneet", en: "Tour rooms", sv: "Rundturens rum" })}>{design.rooms.map(r => <button key={r.id} onClick={() => setRoom(r.id)} aria-current={room === r.id ? "step" : undefined} className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold ${room === r.id ? "border-[#f0bd58] bg-[#f0bd58] text-[#173655]" : "border-white/30"}`}>{r.code} · {text(roomNames[r.kind])}</button>)}</nav><InteriorOptions style={style} setStyle={setStyle} furnished={furnished} setFurnished={setFurnished}/><p className="text-sm leading-6 text-white/65">{text({ fi: "Reaaliaikainen 3D-kierros tilamallista. A12:ssa käytetään kohdekohtaisia tammi-, posliinilaatta- ja pellavatekstuureja. Kalustus ja pinnat ovat konseptivaihtoehtoja.", en: "A real-time 3D tour of the spatial model. A12 uses property-specific oak, porcelain tile and linen textures. Furnishings and finishes are concept options.", sv: "En realtidsrundtur i rumsmodellen. A12 använder objektspecifika ek-, porslinskakel- och linnetexturer. Inredning och ytskikt är konceptalternativ." })}</p>{notice && <p role="status" className="text-sm">{notice}</p>}</div>
  </section>;
}
