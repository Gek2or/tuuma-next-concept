"use client";
/* R3F exposes imperative camera/renderer resources, not React state. Updated only in effects. */
/* eslint-disable react-hooks/immutability */
import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import { Box, Camera, Expand, Map, Moon, RotateCcw, Sun } from "lucide-react";
import * as THREE from "three";
import { designFor, roomNames, stairProfile, type Design } from "@/lib/architecture";
import { apartments, type Apartment } from "@/lib/data";
import { ArchitecturalModel, type InteriorStyle } from "./ArchitecturalModel";
import { InteriorOptions, ModelFallback, SceneBoundary, StudioEnvironment, useSceneQuality, useSceneReady } from "./ApartmentDollhouse";
import { PlanGeometry } from "./ApartmentPlan";
import { useLanguage } from "./LanguageProvider";
import { panoramaFor } from "@/lib/panoramas";
import RenderedPhotoTour from "./RenderedPhotoTour";
export function cameraSpot(design: Design, id: string): [
    number,
    number,
    number
] {
    const room = design.rooms.find(r => r.id === id)!;
    const stairs = stairProfile(design);
    if (room.code === "PORRAS" && stairs) {
        const cross = (room.level ?? 1) === 1 ? stairs.nearLane : stairs.farLane;
        return stairs.axis === "x"
            ? [room.x / 1000 + stairs.start / 2, ((room.level ?? 1) - 1) * (design.height / 1000 + .22) + 1.6, room.z / 1000 + cross]
            : [room.x / 1000 + cross, ((room.level ?? 1) - 1) * (design.height / 1000 + .22) + 1.6, room.z / 1000 + stairs.start / 2];
    }
    const options = [.5, .65, .35, .8, .2].flatMap(x => [.5, .7, .3, .85].map(z => ({ x: room.x + room.w * x, z: room.z + room.d * z })));
    const spot = options.find(p => !design.fittings.some(f => f.room === id && f.kind !== "rug" && p.x > f.x - 200 && p.x < f.x + f.w + 200 && p.z > f.z - 200 && p.z < f.z + f.d + 200)) ?? options[0];
    const storeyOffset = ((room.level ?? 1) - 1) * (design.height / 1000 + .22);
    return [spot.x / 1000, storeyOffset + 1.6, spot.z / 1000];
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
        const storeyOffset = ((r.level ?? 1) - 1) * (design.height / 1000 + .22);
        camera.lookAt((r.x + r.w * .55) / 1000, storeyOffset + 1.4, (r.z + 350) / 1000);
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
            if (r.code === "PORRAS") return;
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
function RenderMood({ lighting }: { lighting: "day" | "evening" }) {
    const { gl, invalidate } = useThree();
    useEffect(() => {
        gl.toneMappingExposure = lighting === "day" ? 1.16 : .94;
        invalidate();
    }, [gl, invalidate, lighting]);
    return null;
}

/** A photographic equirectangular room.  The source image is intentionally
 * kept separate from the spatial model: later it can be replaced with a 6K/8K
 * capture from the property provider without changing the visitor UI. */
function PanoramaSphere({ source }: { source: string }) {
    const texture = useTexture(source);
    useEffect(() => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        texture.needsUpdate = true;
    }, [texture]);
    return <mesh><sphereGeometry args={[30, 72, 48]}/><meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false}/></mesh>;
}

function PanoramaControls({ heading = 0, reset }: { heading?: number; reset: number }) {
    const { camera, gl, invalidate } = useThree();
    useEffect(() => {
        const perspective = camera as THREE.PerspectiveCamera;
        camera.position.set(0, 0, .01);
        const euler = new THREE.Euler(0, heading, 0, "YXZ");
        camera.quaternion.setFromEuler(euler);
        const canvas = gl.domElement;
        canvas.style.touchAction = "none";
        canvas.tabIndex = 0;
        canvas.setAttribute("aria-label", "360° valokuvakierros · drag / arrow keys");
        let dragging = false, lastX = 0, lastY = 0;
        const update = () => { euler.x = THREE.MathUtils.clamp(euler.x, -1.25, 1.25); camera.quaternion.setFromEuler(euler); invalidate(); };
        const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); canvas.focus(); };
        const move = (e: PointerEvent) => { if (!dragging) return; euler.y -= (e.clientX - lastX) * .0036; euler.x -= (e.clientY - lastY) * .0036; lastX = e.clientX; lastY = e.clientY; update(); };
        const up = () => { dragging = false; };
        const key = (e: KeyboardEvent) => {
            if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
            e.preventDefault();
            euler.y += e.key === "ArrowLeft" ? .105 : e.key === "ArrowRight" ? -.105 : 0;
            euler.x += e.key === "ArrowUp" ? .095 : e.key === "ArrowDown" ? -.095 : 0;
            update();
        };
        const wheel = (e: WheelEvent) => { e.preventDefault(); perspective.fov = THREE.MathUtils.clamp(perspective.fov + e.deltaY * .022, 45, 86); perspective.updateProjectionMatrix(); invalidate(); };
        canvas.addEventListener("pointerdown", down);
        canvas.addEventListener("pointermove", move);
        canvas.addEventListener("pointerup", up);
        canvas.addEventListener("pointercancel", up);
        canvas.addEventListener("keydown", key);
        canvas.addEventListener("wheel", wheel, { passive: false });
        invalidate();
        return () => { canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up); canvas.removeEventListener("keydown", key); canvas.removeEventListener("wheel", wheel); };
    }, [camera, gl, heading, reset, invalidate]);
    return null;
}

function PanoramaFallback({ apartment, source }: { apartment: Apartment; source: string }) {
    const { text } = useLanguage();
    return <div className="grid h-full min-h-80 place-items-center overflow-hidden bg-[#e9ebe8] p-4 sm:p-6"><div className="max-w-5xl overflow-hidden rounded-2xl bg-white shadow-[0_16px_35px_rgba(18,49,76,.16)]"><img src={source} alt={text({ fi: `${apartment.id}:n 360°-konseptipanoraama`, en: `${apartment.id} 360° concept panorama`, sv: `${apartment.id} 360°-konceptpanorama` })} className="aspect-[2/1] w-full object-cover"/><p className="p-4 text-center text-sm leading-6 text-[#465f72]">{text({ fi: "Panoraaman vapaa katselu tarvitsee WebGL-tuen. Kuva säilyy katsottavana tällä laitteella.", en: "Free-look panorama needs WebGL. The image remains viewable on this device.", sv: "Panoramans fria vy behöver WebGL. Bilden kan fortfarande ses på den här enheten." })}</p></div></div>;
}

function PhotoTour({ apartment, onOpenModel }: { apartment: Apartment; onOpenModel: () => void }) {
    const { text } = useLanguage();
    const design = designFor(apartment.id);
    const { ref, ready, unavailable } = useSceneReady();
    const compactScene = useSceneQuality();
    const container = useRef<HTMLElement>(null);
    const [room, setRoom] = useState<"living" | "kitchen" | "bedroom">("living");
    const [reset, setReset] = useState(0);
    const [minimap, setMinimap] = useState(false);
    const [notice, setNotice] = useState("");
    const rooms = {
        living: { fi: "Olohuone", en: "Living room", sv: "Vardagsrum" },
        kitchen: { fi: "Keittiö", en: "Kitchen", sv: "Kök" },
        bedroom: { fi: "Makuuhuone", en: "Bedroom", sv: "Sovrum" },
    };
    const source = apartment.tour[room];
    async function fullscreen() { try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else if (container.current?.requestFullscreen) await container.current.requestFullscreen();
        else setNotice(text({ fi: "Koko näyttö ei ole käytettävissä tässä selaimessa.", en: "Fullscreen is unavailable in this browser.", sv: "Helskärm är inte tillgängligt i denna webbläsare." }));
    } catch { setNotice(text({ fi: "Selain ei sallinut koko näytön tilaa.", en: "The browser did not allow fullscreen.", sv: "Webbläsaren tillät inte helskärm." })); } }
    return <section ref={container} className="architecture-tour overflow-hidden rounded-3xl border border-white/20 bg-[#173655] text-white"><header className="flex flex-wrap justify-between gap-3 p-4 sm:gap-4 sm:p-5"><div><p className="text-xs font-bold tracking-[.17em] text-white/60">CONCEPT 360 / {apartment.id} / CONCEPT</p><h3 className="mt-1 text-xl font-semibold">{text(rooms[room])}</h3></div><div className="flex gap-2"><button onClick={onOpenModel} aria-label={text({ fi: "Avaa reaaliaikainen 3D-malli", en: "Open real-time 3D model", sv: "Öppna 3D-modell i realtid" })} className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><Box size={18}/></button><button onClick={() => setMinimap(!minimap)} aria-pressed={minimap} aria-label={text({ fi: "Pohjakartta", en: "Floor map", sv: "Plankarta" })} className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><Map size={20}/></button><button onClick={() => setReset(reset + 1)} aria-label={text({ fi: "Palauta näkymä", en: "Reset view", sv: "Återställ vy" })} className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><RotateCcw size={18}/></button><button onClick={() => void fullscreen()} aria-label={text({ fi: "Koko näyttö", en: "Fullscreen", sv: "Helskärm" })} className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><Expand size={20}/></button></div></header>
      <div ref={ref} className="tour-viewport relative h-[min(58svh,430px)] min-h-[340px] bg-[#e1e7e5] sm:h-[650px]">{unavailable && <PanoramaFallback apartment={apartment} source={source}/>}<SceneBoundary fallback={<PanoramaFallback apartment={apartment} source={source}/>}>{ready && <Canvas key={`${apartment.id}-${room}`} dpr={compactScene ? [1, 1.35] : [1, 2]} camera={{ position: [0, 0, .01], fov: 70, near: .01, far: 100 }} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.toneMapping = THREE.NoToneMapping; }}><PanoramaSphere source={source}/><PanoramaControls heading={apartment.tour.startHeading} reset={reset}/></Canvas>}</SceneBoundary><div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_32%_18%,rgba(255,241,208,.1),transparent_44%),linear-gradient(180deg,rgba(255,255,255,.035),transparent_25%,rgba(14,32,42,.14))]"/>{minimap && <div className="absolute right-3 top-3 w-40 max-w-[56%] rounded-2xl border bg-white/95 p-2 shadow-lg sm:w-52 sm:max-w-[60%] sm:p-3"><svg viewBox={`-400 -2100 ${design.width + 800} ${design.depth + 2800}`} aria-label={text({ fi: "Pohjakartta", en: "Floor map", sv: "Plankarta" })}><PlanGeometry design={design} furnished={false}/></svg></div>}<div className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-2xl bg-[#173655]/86 px-3 py-2 text-sm shadow-lg backdrop-blur sm:bottom-4 sm:left-4 sm:max-w-[calc(100%-2rem)] sm:px-4 sm:py-3"><b className="block text-white">{text({ fi: "Kuvitettu kierros · vedä katsoaksesi", en: "Illustrated tour · drag to look", sv: "Illustrerad tur · dra för att se" })}</b><span className="mt-1 hidden text-xs text-white/72 sm:block">{text({ fi: "Nuolinäppäimet · katso jokaiseen suuntaan · käytä huonenavigaattoria", en: "Arrow keys · look in every direction · use room navigation", sv: "Piltangenter · se åt alla håll · använd rumsnavigering" })}</span></div></div>
      <div className="space-y-4 p-4 sm:p-5"><nav className="hide-scrollbar flex snap-x gap-2 overflow-x-auto pb-2" aria-label={text({ fi: "Valokuvakierroksen huoneet", en: "Illustrated tour rooms", sv: "Illustrerad turens rum" })}>{(Object.keys(rooms) as Array<keyof typeof rooms>).filter((item, index, all) => all.findIndex(key => apartment.tour[key] === apartment.tour[item]) === index).map(item => <button key={item} onClick={() => setRoom(item)} aria-current={room === item ? "step" : undefined} className={`min-h-11 shrink-0 snap-start rounded-full border px-4 text-sm font-semibold ${room === item ? "border-[#f0bd58] bg-[#f0bd58] text-[#173655]" : "border-white/30"}`}>{text(rooms[item])}</button>)}</nav><div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-sm leading-6 text-white/78"><Camera className="shrink-0 text-[#f0bd58]" size={18}/><span>{text({ fi: "Luotu 360°-konseptikuva. Se havainnollistaa tunnelmaa eikä vastaa tarkasti pohjapiirustusta.", en: "Generated 360° concept image. It illustrates atmosphere and does not precisely match the floor plan.", sv: "Genererad 360°-konceptbild. Den visar stämningen och motsvarar inte planritningen exakt." })}</span></div>{notice && <p role="status" className="text-sm">{notice}</p>}</div>
    </section>;
}
function Portals({ design, room, select }: {
    design: Design;
    room: string;
    select: (id: string) => void;
}) {
    const { text } = useLanguage();
    const current = design.rooms.find(r => r.id === room);
    const stair = stairProfile(design);
    const other = current?.code === "PORRAS" ? design.rooms.find(r => r.code === "PORRAS" && r.id !== room) : undefined;
    return <>{other && stair && current && <Html position={stair.axis === "x" ? [(current.x / 1000) + stair.start + stair.run + .375, ((current.level ?? 1) - 1) * (design.height / 1000 + .22) + 1.4, (current.z / 1000) + current.d / 2000] : [(current.x / 1000) + current.w / 2000, ((current.level ?? 1) - 1) * (design.height / 1000 + .22) + 1.4, (current.z / 1000) + stair.start + stair.run + .375]} center><button onClick={() => select(other.id)} className="min-h-11 whitespace-nowrap rounded-full border-2 border-white bg-[#ffbb18] px-4 text-sm font-bold text-[#22264b]">{text({fi:"Portaat",en:"Stairs",sv:"Trappa"})} → {text({fi:"Taso",en:"Level",sv:"Våning"})} {other.level ?? 1}</button></Html>}{design.walls.filter(w => w.opening && w.opening.kind !== "window" && w.rooms.length === 2 && w.rooms.includes(room)).map(w => { const target = design.rooms.find(r => r.id === w.rooms.find(id => id !== room))!; const middle = (w.opening!.start + w.opening!.width / 2) / 1000; const storeyOffset = ((w.level ?? 1) - 1) * (design.height / 1000 + .22); return <Html key={w.id} position={w.axis === "x" ? [middle, storeyOffset + 1.2, w.at / 1000] : [w.at / 1000, storeyOffset + 1.2, middle]} center zIndexRange={[10, 0]}><button onClick={() => select(target.id)} className="flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border-2 border-white bg-[#173655]/95 px-4 py-2 text-sm font-semibold text-white shadow-xl">{target.code} · {text(roomNames[target.kind])} →</button></Html>; })}</>;
}
function LiveModelTour({ apartment = apartments[0] }: {
    apartment?: Apartment;
}) {
    const { text } = useLanguage();
    const design = designFor(apartment.id);
    const [room, setRoom] = useState("oh"), [tourLevel, setTourLevel] = useState(1), [style, setStyle] = useState<InteriorStyle>(apartment.id === "F20" ? "forest" : apartment.id === "E15" ? "clay" : "nordic"), [furnished, setFurnished] = useState(false), [minimap, setMinimap] = useState(false), [lighting, setLighting] = useState<"day" | "evening">("day"), [reset, setReset] = useState(0), [notice, setNotice] = useState("");
    const { ref, ready, unavailable } = useSceneReady();
    const compactScene = useSceneQuality();
    const container = useRef<HTMLElement>(null);
    const active = design.rooms.find(r => r.id === room)!;
    const visibleTourRooms = design.rooms.filter(item => (item.level ?? 1) === tourLevel);
    useEffect(() => { setTourLevel(active.level ?? 1); }, [active.level]);
    const clearSize = `${(active.w / 1000).toFixed(1).replace(".", ",")} × ${(active.d / 1000).toFixed(1).replace(".", ",")} m${design.levels > 1 ? ` · ${text({ fi: "taso", en: "level", sv: "plan" })} ${active.level ?? 1}` : ""}`;
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

    return <section ref={container} className="architecture-tour overflow-hidden rounded-3xl border border-white/20 bg-[#173655] text-white"><header className="flex flex-wrap justify-between gap-3 p-4 sm:gap-4 sm:p-5"><div><p className="text-xs font-bold tracking-[.17em] text-white/60">360° MODEL TOUR / {apartment.id} / UPDATED</p><h3 className="mt-1 text-xl font-semibold">{active.code} · {text(roomNames[active.kind])}</h3></div><div className="flex gap-2"><button onClick={() => setLighting(lighting === "day" ? "evening" : "day")} aria-pressed={lighting === "evening"} aria-label={text({ fi: "Vaihda päivänvalo ja iltavalo", en: "Switch daylight and evening light", sv: "Växla dagsljus och kvällsljus" })} className="grid h-11 w-11 place-items-center rounded-full bg-white/15">{lighting === "day" ? <Moon size={18}/> : <Sun size={19}/>}</button><button onClick={() => setMinimap(!minimap)} aria-pressed={minimap} aria-label={text({ fi: "Pohjakartta", en: "Floor map", sv: "Plankarta" })} className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><Map size={20}/></button><button onClick={() => setReset(reset + 1)} aria-label={text({ fi: "Palauta näkymä", en: "Reset view", sv: "Återställ vy" })} className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><RotateCcw size={18}/></button><button onClick={() => void fullscreen()} aria-label={text({ fi: "Koko näyttö", en: "Fullscreen", sv: "Helskärm" })} className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><Expand size={20}/></button></div></header>
    <div ref={ref} className="tour-viewport relative h-[min(58svh,430px)] min-h-[340px] bg-[#e1e7e5] sm:h-[650px]">{unavailable && <ModelFallback apartment={apartment}/>}<SceneBoundary fallback={<ModelFallback apartment={apartment}/>}>
      {ready && <Canvas shadows dpr={compactScene ? [1, 1.35] : [1, 2]} camera={{ position: cameraSpot(design, "oh"), fov: 72, near: .03, far: 120 }} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.shadowMap.type = THREE.PCFSoftShadowMap; gl.toneMapping = THREE.ACESFilmicToneMapping; }}><RenderMood lighting={lighting}/><StudioEnvironment/><color attach="background" args={[lighting === "day" ? "#c6dce4" : "#182a35"]}/><hemisphereLight args={[lighting === "day" ? "#f3f6ff" : "#657a96", lighting === "day" ? "#b9aa8f" : "#3b2d27", lighting === "day" ? 2.5 : 1.15]}/><ambientLight intensity={lighting === "day" ? .25 : .55} color={lighting === "day" ? "#ffffff" : "#d7b48e"}/><directionalLight position={[-8, 14, -10]} color={lighting === "day" ? "#fff2d3" : "#d59262"} intensity={lighting === "day" ? 3.7 : .52} castShadow shadow-mapSize={compactScene ? [1024, 1024] : [2048, 2048]} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={18} shadow-camera-bottom={-18} shadow-bias={-.0003}/><spotLight position={[2.8, 5.5, 2.4]} angle={.56} penumbra={.78} intensity={lighting === "day" ? 1.4 : 4.1} color="#ffdfb0" castShadow={false}/><ArchitecturalModel design={design} style={style} furnished={furnished} interior lighting={lighting}/><mesh position={[design.width / 2000, -.3, design.depth / 2000]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[160, 160]}/><meshStandardMaterial color={lighting === "day" ? "#96a788" : "#354138"} roughness={1}/></mesh><LookControls design={design} room={room} reset={reset}/><Portals design={design} room={room} select={setRoom}/></Canvas>}
    </SceneBoundary><div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_32%_18%,rgba(255,241,208,.16),transparent_46%),linear-gradient(180deg,rgba(255,255,255,.04),transparent_24%,rgba(14,32,42,.12))]"/><div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#153147]/20 to-transparent"/>{minimap && <div className="absolute right-3 top-3 w-40 max-w-[56%] rounded-2xl border bg-white/95 p-2 shadow-lg sm:w-52 sm:max-w-[60%] sm:p-3"><svg viewBox={`-400 -2100 ${design.width + 800} ${design.depth + 2800}`} aria-label={text({ fi: "Pohjakartta", en: "Floor map", sv: "Plankarta" })}><PlanGeometry design={design} active={room} select={setRoom} furnished={false} level={active.level ?? 1}/></svg></div>}<div className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-2xl bg-[#173655]/86 px-3 py-2 text-sm shadow-lg backdrop-blur sm:bottom-4 sm:left-4 sm:max-w-[calc(100%-2rem)] sm:px-4 sm:py-3"><b className="block text-white">{clearSize} · {text(finish)}</b><span className="mt-1 hidden text-xs text-white/72 sm:block">{text({ fi: "Vedä katsoaksesi · W A S D liikkuu huoneessa", en: "Drag to look · W A S D moves inside the room", sv: "Dra för att se · W A S D rör sig i rummet" })}</span><span className="mt-1 block text-xs text-white/72 sm:hidden">{text({ fi: "Vedä katsoaksesi", en: "Drag to look", sv: "Dra för att se" })}</span></div></div>
    <div className="space-y-4 p-4 sm:p-5">{design.levels > 1 && <div className="flex flex-wrap items-center gap-2" role="group" aria-label={text({ fi: "Kierroksen taso", en: "Tour level", sv: "Rundturens våning" })}><span className="mr-1 text-xs font-black uppercase tracking-[.14em] text-white/55">{text({ fi: "Taso", en: "Level", sv: "Plan" })}</span>{Array.from({ length: design.levels }, (_, index) => index + 1).map(level => <button key={level} onClick={() => { setTourLevel(level); const nextRoom = design.rooms.find(item => item.code === "PORRAS" && (item.level ?? 1) === level) ?? design.rooms.find(item => (item.level ?? 1) === level); if (nextRoom) setRoom(nextRoom.id); }} aria-pressed={tourLevel === level} className={`min-h-10 rounded-full px-4 text-sm font-bold ${tourLevel === level ? "bg-white text-[#173655]" : "border border-white/30 text-white"}`}>{text({ fi: "Taso", en: "Level", sv: "Plan" })} {level}</button>)}</div>}<nav className="hide-scrollbar flex snap-x gap-2 overflow-x-auto pb-2" aria-label={text({ fi: "Kierroksen huoneet", en: "Tour rooms", sv: "Rundturens rum" })}>{visibleTourRooms.map(r => <button key={r.id} onClick={() => setRoom(r.id)} aria-current={room === r.id ? "step" : undefined} className={`min-h-11 shrink-0 snap-start rounded-full border px-4 text-sm font-semibold ${room === r.id ? "border-[#f0bd58] bg-[#f0bd58] text-[#173655]" : "border-white/30"}`}>{r.code} · {text(roomNames[r.kind])}</button>)}</nav><InteriorOptions style={style} setStyle={setStyle} furnished={furnished} setFurnished={setFurnished}/><p className="text-sm leading-6 text-white/65">{text({ fi: "Reaaliaikainen 3D-kierros alkuperäisestä tilamallista. Kalliolinnan täysissä esimerkeissä käytetään kohdekohtaista tammi-, posliinilaatta- ja pellavateksturointia. Ikkunoiden takana näkyy yhteinen puutarhan konseptitausta; se ei ole kohteen valokuvapanoraama. Kalustus ja pinnat ovat konseptivaihtoehtoja.", en: "A real-time 3D tour of the original spatial model. Complete Kalliolinna examples use property-specific oak, porcelain tile and linen textures. Outside the windows is a shared garden concept backdrop, not a property photo panorama. Furnishings and finishes are concept options.", sv: "En realtidsrundtur i den ursprungliga rumsmodellen. Kalliolinnas kompletta exempel använder objektspecifika texturer av ek, porslinskakel och linne. Bakom fönstren syns en gemensam konceptbakgrund av en trädgård, inte ett fotopanorama av objektet. Inredning och ytskikt är konceptalternativ." })}</p>{notice && <p role="status" className="text-sm">{notice}</p>}</div>
  </section>;
}

export default function Tour360Viewer({ apartment = apartments[0] }: { apartment?: Apartment }) {
    const { text } = useLanguage();
    const [mode, setMode] = useState<"model" | "panorama">("model");
    const correctedShowcase = ["C09", "E15", "F20"].includes(apartment.id);
    const hasPanorama = !correctedShowcase && /-360\.webp$/i.test(apartment.tour.living);
    const renderedHome = panoramaFor(apartment.id);
    if (renderedHome && !correctedShowcase) return <RenderedPhotoTour key={apartment.id} home={renderedHome} />;
    return <div>{hasPanorama && <div className="mb-3 flex flex-wrap gap-2"><button className="min-h-11 rounded-full border px-4 text-sm font-bold" aria-pressed={mode === "model"} onClick={() => setMode("model")}>3D</button><button className="min-h-11 rounded-full border px-4 text-sm font-bold" aria-pressed={mode === "panorama"} onClick={() => setMode("panorama")}>{text({fi: "Kuvitettu 360°", en: "Illustrated 360°", sv: "Illustrerad 360°"})}</button></div>}{mode === "model" ? <LiveModelTour key={apartment.id} apartment={apartment}/> : <PhotoTour key={apartment.id} apartment={apartment} onOpenModel={() => setMode("model")}/>}</div>;
}
