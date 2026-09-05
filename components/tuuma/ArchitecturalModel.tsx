"use client";
import { useEffect, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { Design, Fitting, Wall } from "@/lib/architecture";
export type InteriorStyle = "nordic" | "clay" | "forest";
const styles = { nordic: { wall: "#f2f0e9", fabric: "#bbc4be", cabinet: "#d5d4c6", wood: "#b79060" }, clay: { wall: "#eee5da", fabric: "#b47c66", cabinet: "#ac6b51", wood: "#ad794e" }, forest: { wall: "#e5e8df", fabric: "#586e60", cabinet: "#526559", wood: "#b8996c" } };
function seededRandom() { let seed = 417; return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
export function useSurface(kind: "wood" | "tile" | "brick" | "timber", base: string) {
    const texture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 512;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, 512, 512);
        const rand = seededRandom();
        if (kind === "wood" || kind === "timber") {
            for (let p = 0; p < 8; p++) {
                ctx.fillStyle = `rgba(${p % 2 ? "255,246,220" : "48,29,12"},${.03 + rand() * .09})`;
                ctx.fillRect(p * 64, 0, 63, 512);
                for (let i = 0; i < 70; i++) {
                    const x = p * 64 + rand() * 63;
                    ctx.strokeStyle = `rgba(57,34,15,${rand() * .15})`;
                    ctx.lineWidth = .3 + rand();
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    for (let y = 0; y <= 512; y += 16)
                        ctx.lineTo(x + Math.sin(y / 70 + p) * 2 + rand(), y);
                    ctx.stroke();
                }
                ctx.fillStyle = "rgba(53,38,21,.25)";
                ctx.fillRect(p * 64, 0, 1, 512);
                if (kind === "wood") {
                    ctx.fillRect(p * 64, (p % 3) * 160 + 15, 64, 1);
                }
            }
        }
        else if (kind === "tile") {
            ctx.strokeStyle = "#b2aca1";
            ctx.lineWidth = 2;
            for (let i = 0; i <= 512; i += 128) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 512);
                ctx.moveTo(0, i);
                ctx.lineTo(512, i);
                ctx.stroke();
            }
        }
        else {
            for (let row = 0; row < 8; row++)
                for (let col = -1; col < 5; col++) {
                    ctx.fillStyle = `rgba(42,20,10,${rand() * .2})`;
                    ctx.fillRect(col * 128 + (row % 2) * 64 + 3, row * 64 + 3, 122, 58);
                }
            ctx.strokeStyle = "#b9a996";
            ctx.lineWidth = 4;
            for (let row = 0; row < 8; row++) {
                ctx.beginPath();
                ctx.moveTo(0, row * 64);
                ctx.lineTo(512, row * 64);
                for (let col = 0; col < 5; col++) {
                    const x = col * 128 + (row % 2) * 64;
                    ctx.moveTo(x, row * 64);
                    ctx.lineTo(x, row * 64 + 64);
                }
                ctx.stroke();
            }
        }
        for (let i = 0; i < 18000; i++) {
            ctx.fillStyle = `rgba(${rand() > .5 ? "255,255,255" : "0,0,0"},.035)`;
            ctx.fillRect(rand() * 512, rand() * 512, 1, 1);
        }
        const map = new THREE.CanvasTexture(canvas);
        map.colorSpace = THREE.SRGBColorSpace;
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(kind === "wood" ? 3 : 2, kind === "wood" ? 2 : 2);
        map.anisotropy = 8;
        return map;
    }, [kind, base]);
    useEffect(() => () => texture.dispose(), [texture]);
    return texture;
}
export function Block({ p, s, color = "#eeeae3", map, round = false, roughness = .75 }: {
    p: [
        number,
        number,
        number
    ];
    s: [
        number,
        number,
        number
    ];
    color?: string;
    map?: THREE.Texture;
    round?: boolean;
    roughness?: number;
}) {
    const material = <meshStandardMaterial color={color} map={map} roughness={roughness} bumpMap={map} bumpScale={map ? .002 : 0}/>;
    return round ? <RoundedBox position={p} args={s} radius={Math.min(.04, ...s.map(v => v / 4))} smoothness={2} castShadow receiveShadow>{material}</RoundedBox> : <mesh position={p} castShadow receiveShadow><boxGeometry args={s}/>{material}</mesh>;
}
function Furniture({ item: i, style, wood }: {
    item: Fitting;
    style: InteriorStyle;
    wood: THREE.Texture;
}) {
    const w = i.w / 1000, d = i.d / 1000, p = styles[style];
    const box = (x: number, y: number, z: number, a: number, b: number, c: number, color: string, round = false, map?: THREE.Texture) => <Block p={[x, y, z]} s={[a, b, c]} color={color} round={round} map={map}/>;
    let shape;
    switch (i.kind) {
        case "bed":
            shape = <>{box(w / 2, .23, d / 2, w, .32, d, "#fff", false, wood)}{box(w / 2, .46, d / 2, w - .04, .22, d - .04, "#faf8f0", true)}{box(w / 2, .59, d * .65, w - .06, .1, d * .6, p.fabric, true)}{box(w / 2, .70, .08, w + .02, 1.05, .10, p.fabric, true)}{[.28, .72].map(x => <Block key={x} p={[w * x, .61, .36]} s={[w * .40, .16, .46]} color="#f8f5ee" round/>)}</>;
            break;
        case "sofa":
            shape = <>{box(w / 2, .28, d / 2, w, .38, d, p.fabric, true)}{box(w / 2, .74, .1, w, .60, .20, p.fabric, true)}{[.08, w - .08].map(x => <Block key={x} p={[x, .57, d / 2]} s={[.16, .60, d]} color={p.fabric} round/>)}{[.25, .5, .75].map(x => <Block key={x} p={[w * x, .54, d * .57]} s={[w * .24, .18, d * .70]} color={p.fabric} round/>)}{box(.40, .72, .40, .42, .40, .16, "#e8dcc8", true)}</>;
            break;
        case "rug":
            shape = box(w / 2, .012, d / 2, w, .018, d, "#d6cbbc", true);
            break;
        case "table":
            shape = <>{box(w / 2, .74, d / 2, w, .06, d, "white", true, wood)}{[.1, w - .1].flatMap(x => [.1, d - .1].map(z => <Block key={`${x}-${z}`} p={[x, .36, z]} s={[.055, .72, .055]} color="#86694c"/>))}</>;
            break;
        case "chair":
            shape = <>{box(w / 2, .44, d / 2, w, .07, d, p.fabric, true)}{box(w / 2, .70, .03, w, .48, .04, p.cabinet, true)}{[.05, w - .05].flatMap(x => [.05, d - .05].map(z => <Block key={`${x}-${z}`} p={[x, .22, z]} s={[.035, .44, .035]} color="#81684c"/>))}</>;
            break;
        case "kitchen":
            shape = <>{box(w / 2, .42, d / 2, w, .80, d, p.cabinet)}{box(w / 2, .85, d / 2, w + .02, .045, d + .04, "#e6e0d4", false)}{box(w / 2, 1.18, .02, w, .60, .03, "#ede8df")}{Array.from({ length: Math.ceil(w / .6) }, (_, n) => <group key={n}><Block p={[n * .58 + .285, .43, d + .008]} s={[.56, .75, .025]} color={p.cabinet}/><Block p={[n * .58 + .285, .72, d + .03]} s={[.22, .012, .024]} color="#72736b"/></group>)}{box(w / 2, 1.87, .18, w, .72, .36, p.cabinet)}</>;
            break;
        case "fridge":
            shape = <>{box(w / 2, 1.03, d / 2, w, 2.06, d, "#ebece5")}{box(w / 2, 1.22, d + .008, w - .03, .012, .014, "#94998e")}{box(w - .07, 1.52, d + .04, .025, .38, .035, "#8c918a")}</>;
            break;
        case "sink":
        case "basin":
            shape = <>{i.kind === "basin" && box(w / 2, .44, d / 2, w, .75, d, p.cabinet)}{box(w / 2, .88, d / 2, w, .07, d, "#f9f9f4", true)}{box(w / 2, .92, d * .53, w * .72, .008, d * .65, "#bfc9c7", true)}{box(w / 2, 1.05, .06, .035, .30, .035, "#788c90")}{box(w / 2, 1.20, .13, .035, .035, .16, "#788c90")}</>;
            break;
        case "hob":
            shape = <>{box(w / 2, .889, d / 2, w, .016, d, "#18252b")}{[.25, .75].flatMap(x => [.25, .75].map(z => <mesh key={`${x}-${z}`} position={[w * x, .9, d * z]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.066, .073, 24]}/><meshStandardMaterial color="#b2b8ba"/></mesh>))}</>;
            break;
        case "wardrobe":
            shape = <>{box(w / 2, 1.12, d / 2, w, 2.24, d, "#e4dfd3")}{box(w / 2, 1.1, d + .02, .02, 2.1, .02, "#8e9187")}</>;
            break;
        case "shower":
            shape = <>{box(w / 2, .012, d / 2, w, .025, d, "#c2c6c1")}{box(w * .5, .03, d * .5, .12, .015, .12, "#71827f")}<mesh position={[w, 1.05, d / 2]}><boxGeometry args={[.008, 2.1, d]}/><meshPhysicalMaterial color="#cce3df" transparent opacity={.17} roughness={.1} depthWrite={false}/></mesh>{box(.10, 1.25, .05, .025, .90, .03, "#829295")}{box(.1, 1.90, .16, .22, .035, .30, "#aeb7b5")}</>;
            break;
        case "wc":
            shape = <>{box(w / 2, .40, .12, w, .68, .24, "#f5f6f3", true)}<mesh position={[w / 2, .29, d * .63]} scale={[w * .48, .28, d * .47]} castShadow><sphereGeometry args={[1, 24, 16]}/><meshStandardMaterial color="#f5f6f3" roughness={.2}/></mesh>{box(w / 2, .49, d * .6, w, .04, d * .60, "#fcfdf9", true)}</>;
            break;
        case "washer":
            shape = <>{box(w / 2, .43, d / 2, w, .85, d, "#f3f5f0")}<mesh position={[w / 2, .40, d + .015]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.21, .21, .03, 32]}/><meshStandardMaterial color="#374c55" metalness={.4} roughness={.15}/></mesh>{box(w / 2, .77, d + .018, w - .05, .08, .02, "#c1c8c7")}</>;
            break;
        case "bench":
            shape = <>{[0, 1, 2, 3, 4, 5].map(n => <Block key={n} p={[w / 2, .85, .045 + n * .095]} s={[w, .065, .085]} color="white" map={wood}/>)}{box(w / 2, .40, d + .12, w, .07, .24, "white", false, wood)}</>;
            break;
        case "heater":
            shape = <>{box(w / 2, .40, d / 2, w, .65, d, "#3c4646")}{Array.from({ length: 12 }, (_, n) => <mesh key={n} position={[.06 + (n % 4) * .10, .74, Math.floor(n / 4) * .10 + .06]} castShadow><dodecahedronGeometry args={[.065]}/><meshStandardMaterial color="#68706b" roughness={1}/></mesh>)}</>;
            break;
    }
    return <group position={[i.x / 1000, 0, i.z / 1000]}>{shape}</group>;
}
function ArchitecturalWall({ wall: w, height, wallColor, cutaway }: {
    wall: Wall;
    height: number;
    wallColor: string;
    cutaway: boolean;
}) {
    const h = cutaway ? Math.min(height, 1.15) : height, o = w.opening, t = w.thickness / 1000;
    const box = (start: number, end: number, bottom: number, top: number, color = wallColor) => top > bottom && end > start ? <Block p={[(start + end) / 2000, (bottom + top) / 2, 0]} s={[(end - start) / 1000, top - bottom, t]} color={color}/> : null;
    return <group position={w.axis === "x" ? [0, 0, w.at / 1000] : [w.at / 1000, 0, 0]} rotation={[0, w.axis === "x" ? 0 : -Math.PI / 2, 0]}>
    {o ? <>{box(w.start, o.start, 0, h)}{box(o.start + o.width, w.end, 0, h)}{box(o.start, o.start + o.width, 0, Math.min(h, o.sill / 1000))}{box(o.start, o.start + o.width, (o.sill + o.height) / 1000, h)}
      {o.kind === "window" && <group position={[(o.start + o.width / 2) / 1000, 0, 0]}>
        <mesh position={[0, (o.sill / 1000 + Math.min(h, (o.sill + o.height) / 1000)) / 2, 0]}><boxGeometry args={[o.width / 1000, .001 + Math.min(o.height / 1000, h - o.sill / 1000), .015]}/><meshPhysicalMaterial color="#b6d8e1" transparent opacity={.18} roughness={.08} metalness={.12} depthWrite={false}/></mesh>
        {[o.sill / 1000, Math.min(h, (o.sill + o.height) / 1000)].map(y => <Block key={y} p={[0, y, 0]} s={[o.width / 1000, .055, .13]} color="#e4e2d9"/>)}
        {[-o.width / 2000, 0, o.width / 2000].map(x => <Block key={x} p={[x, (o.sill / 1000 + Math.min(h, (o.sill + o.height) / 1000)) / 2, 0]} s={[.055, Math.max(.05, Math.min(h - o.sill / 1000, o.height / 1000)), .13]} color="#dadbd3"/>)}
        {o.sill > 0 && <Block p={[0, .38, t / 2 + .08]} s={[o.width / 1000 - .20, .45, .09]} color="#e9e9e1"/>}
      </group>}
      {o.kind === "door" && <group position={[o.start / 1000, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><Block p={[o.width / 2000, Math.min(h, 2.05) / 2, 0]} s={[o.width / 1000 - .06, Math.min(h, 2.05), .035]} color="#dcd4c7"/></group>}
    </> : box(w.start, w.end, 0, h)}
    {(o ? [[w.start, o.start], [o.start + o.width, w.end]] : [[w.start, w.end]]).map(([a, b], i) => <group key={i}>{[-t / 2, t / 2].map(z => <Block key={z} p={[(a + b) / 2000, .045, z]} s={[(b - a) / 1000, .09, .025]} color="#d7d5c9"/>)}</group>)}
  </group>;
}
export function ArchitecturalModel({ design, style = "nordic", furnished = true, cutaway = false, interior = false }: {
    design: Design;
    style?: InteriorStyle;
    furnished?: boolean;
    cutaway?: boolean;
    interior?: boolean;
}) {
    const palette = styles[style];
    const wood = useSurface("wood", palette.wood), tile = useSurface("tile", "#cbc9c0");
    return <group>
    <Block p={[design.width / 2000, -.12, design.depth / 2000]} s={[design.width / 1000 + .30, .22, design.depth / 1000 + .30]} color="#cecfc7"/>
    {design.rooms.map(r => <group key={r.id}>
      <mesh position={[(r.x + r.w / 2) / 1000, .007, (r.z + r.d / 2) / 1000]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[r.w / 1000, r.d / 1000]}/><meshStandardMaterial map={["bathroom", "hall"].includes(r.kind) ? tile : wood} bumpMap={["bathroom", "hall"].includes(r.kind) ? tile : wood} bumpScale={.003} roughness={.77}/></mesh>
      {interior && <mesh position={[(r.x + r.w / 2) / 1000, design.height / 1000, (r.z + r.d / 2) / 1000]} rotation={[Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[r.w / 1000, r.d / 1000]}/><meshStandardMaterial color="#f6f3eb"/></mesh>}
      {interior && <pointLight position={[(r.x + r.w / 2) / 1000, 2.38, (r.z + r.d / 2) / 1000]} color={r.kind === "sauna" ? "#ffcd83" : "#fff0d8"} intensity={r.kind === "sauna" ? 5 : 9} distance={6} decay={2}/>}
      {interior && <mesh position={[(r.x + r.w / 2) / 1000, 2.56, (r.z + r.d / 2) / 1000]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[.16, 24]}/><meshStandardMaterial color="#fff5d7" emissive="#fff3d3" emissiveIntensity={2}/></mesh>}
    </group>)}
    {design.walls.map(w => <ArchitecturalWall key={w.id} wall={w} height={design.height / 1000} wallColor={w.rooms.includes("s") ? "#c1a27b" : palette.wall} cutaway={cutaway}/>)}
    {design.fittings.filter(f => furnished || f.fixed).map(f => <Furniture key={f.id} item={f} style={style} wood={wood}/>)}
    <group position={[design.outdoor.x / 1000, 0, design.outdoor.z / 1000]}><Block p={[design.outdoor.w / 2000, -.045, design.outdoor.d / 2000]} s={[design.outdoor.w / 1000, .08, design.outdoor.d / 1000]} color="white" map={wood}/>{!design.outdoor.terrace && <><Block p={[design.outdoor.w / 2000, 1.05, .04]} s={[design.outdoor.w / 1000, .04, .04]} color="#596f75"/><mesh position={[design.outdoor.w / 2000, .55, .04]}><boxGeometry args={[design.outdoor.w / 1000, 1, .012]}/><meshPhysicalMaterial color="#9cbdc5" transparent opacity={.3} roughness={.12} depthWrite={false}/></mesh></>}</group>
  </group>;
}
