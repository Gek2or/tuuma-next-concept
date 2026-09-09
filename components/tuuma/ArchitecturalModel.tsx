"use client";
import { Suspense, useEffect, useMemo } from "react";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { stairProfile, type Design, type Fitting, type Wall } from "@/lib/architecture";
export type InteriorStyle = "nordic" | "clay" | "forest";
export type TourLighting = "day" | "evening";
const styles = {
  nordic: {
    wall: "#f2f0e9",
    fabric: "#bbc4be",
    cabinet: "#d5d4c6",
    wood: "#b79060",
  },
  clay: {
    wall: "#eee5da",
    fabric: "#b47c66",
    cabinet: "#ac6b51",
    wood: "#ad794e",
  },
  forest: {
    wall: "#e5e8df",
    fabric: "#586e60",
    cabinet: "#526559",
    wood: "#b8996c",
  },
};
function seededRandom() {
  let seed = 417;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
export function useSurface(
  kind: "wood" | "tile" | "brick" | "timber",
  base: string,
) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 512);
    const rand = seededRandom();
    if (kind === "wood" || kind === "timber") {
      for (let p = 0; p < 8; p++) {
        ctx.fillStyle = `rgba(${p % 2 ? "255,246,220" : "48,29,12"},${0.03 + rand() * 0.09})`;
        ctx.fillRect(p * 64, 0, 63, 512);
        for (let i = 0; i < 70; i++) {
          const x = p * 64 + rand() * 63;
          ctx.strokeStyle = `rgba(57,34,15,${rand() * 0.15})`;
          ctx.lineWidth = 0.3 + rand();
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
    } else if (kind === "tile") {
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
    } else {
      for (let row = 0; row < 8; row++)
        for (let col = -1; col < 5; col++) {
          ctx.fillStyle = `rgba(42,20,10,${rand() * 0.2})`;
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
      ctx.fillStyle = `rgba(${rand() > 0.5 ? "255,255,255" : "0,0,0"},.035)`;
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
export function Block({
  p,
  s,
  color = "#eeeae3",
  map,
  round = false,
  roughness = 0.75,
  metalness = 0,
}: {
  p: [number, number, number];
  s: [number, number, number];
  color?: string;
  map?: THREE.Texture;
  round?: boolean;
  roughness?: number;
  metalness?: number;
}) {
  const material = (
    <meshStandardMaterial
      color={color}
      map={map}
      roughness={roughness}
      metalness={metalness}
      bumpMap={map}
      bumpScale={map ? 0.002 : 0}
    />
  );
  return round ? (
    <RoundedBox
      position={p}
      args={s}
      radius={Math.min(0.04, ...s.map((v) => v / 4))}
      smoothness={2}
      castShadow
      receiveShadow
    >
      {material}
    </RoundedBox>
  ) : (
    <mesh position={p} castShadow receiveShadow>
      <boxGeometry args={s} />
      {material}
    </mesh>
  );
}
function Furniture({
  item: i,
  style,
  wood,
  linen,
  stone,
  levelOffset = 0,
}: {
  item: Fitting;
  style: InteriorStyle;
  wood: THREE.Texture;
  linen?: THREE.Texture;
  stone?: THREE.Texture;
  levelOffset?: number;
}) {
  const w = i.w / 1000,
    d = i.d / 1000,
    p = styles[style];
  const box = (
    x: number,
    y: number,
    z: number,
    a: number,
    b: number,
    c: number,
    color: string,
    round = false,
    map?: THREE.Texture,
  ) => (
    <Block p={[x, y, z]} s={[a, b, c]} color={color} round={round} map={map} />
  );
  let shape;
  switch (i.kind) {
    case "bed":
      shape = (
        <>
          {box(w / 2, 0.23, d / 2, w, 0.32, d, "#fff", false, wood)}
          {box(
            w / 2,
            0.46,
            d / 2,
            w - 0.04,
            0.22,
            d - 0.04,
            "#faf8f0",
            true,
            linen,
          )}
          {box(
            w / 2,
            0.59,
            d * 0.65,
            w - 0.06,
            0.1,
            d * 0.6,
            p.fabric,
            true,
            linen,
          )}
          {box(w / 2, 0.7, 0.08, w + 0.02, 1.05, 0.1, p.fabric, true, linen)}
          {[0.28, 0.72].map((x) => (
            <Block
              key={x}
              p={[w * x, 0.61, 0.36]}
              s={[w * 0.4, 0.16, 0.46]}
              color="#f8f5ee"
              round
              map={linen}
            />
          ))}
          {[0.1, w - 0.1].flatMap((x) => [0.14, d - 0.14].map((z) => <Block key={`${x}-${z}`} p={[x, 0.11, z]} s={[0.055, 0.22, 0.055]} color="#493d33" metalness={0.18} roughness={0.38} />))}
          {box(w * 0.5, 0.68, d * 0.82, w * 0.94, 0.055, d * 0.28, "#778671", true, linen)}
        </>
      );
      break;
    case "sofa":
      shape = (
        <>
          {box(w / 2, 0.28, d / 2, w, 0.38, d, p.fabric, true, linen)}
          {box(w / 2, 0.74, 0.1, w, 0.6, 0.2, p.fabric, true, linen)}
          {[0.08, w - 0.08].map((x) => (
            <Block
              key={x}
              p={[x, 0.57, d / 2]}
              s={[0.16, 0.6, d]}
              color={p.fabric}
              round
              map={linen}
            />
          ))}
          {[0.25, 0.5, 0.75].map((x) => (
            <Block
              key={x}
              p={[w * x, 0.54, d * 0.57]}
              s={[w * 0.24, 0.18, d * 0.7]}
              color={p.fabric}
              round
              map={linen}
            />
          ))}
          {box(0.4, 0.72, 0.4, 0.42, 0.4, 0.16, "#e8dcc8", true, linen)}
          {[0.12, w - 0.12].flatMap((x) => [0.12, d - 0.12].map((z) => <Block key={`${x}-${z}`} p={[x, 0.1, z]} s={[0.05, 0.22, 0.05]} color="#453f38" metalness={0.3} roughness={0.42} />))}
        </>
      );
      break;
    case "rug":
      shape = box(w / 2, 0.012, d / 2, w, 0.018, d, "#d6cbbc", true);
      break;
    case "table":
      shape = (
        <>
          {box(w / 2, 0.74, d / 2, w, 0.06, d, "#d6b889", true, wood)}
          {[0.1, w - 0.1].flatMap((x) =>
            [0.1, d - 0.1].map((z) => (
              <Block
                key={`${x}-${z}`}
                p={[x, 0.36, z]}
                s={[0.055, 0.72, 0.055]}
                color="#86694c"
              />
            )),
          )}
        </>
      );
      break;
    case "chair":
      shape = (
        <>
          {box(w / 2, 0.44, d / 2, w, 0.07, d, p.fabric, true, linen)}
          {box(w / 2, 0.7, 0.03, w, 0.48, 0.04, p.cabinet, true)}
          {[0.05, w - 0.05].flatMap((x) =>
            [0.05, d - 0.05].map((z) => (
              <Block
                key={`${x}-${z}`}
                p={[x, 0.22, z]}
                s={[0.035, 0.44, 0.035]}
                color="#81684c"
              />
            )),
          )}
        </>
      );
      break;
    case "kitchen":
      shape = (
        <>
          {box(w / 2, 0.42, d / 2, w, 0.8, d, p.cabinet)}
          <Block p={[w / 2, 0.85, d / 2]} s={[w + 0.02, 0.045, d + 0.04]} color="#f3f1e9" map={stone} roughness={0.28} />
          <Block p={[w / 2, 1.18, 0.02]} s={[w, 0.6, 0.03]} color="#f3f1e9" map={stone} roughness={0.34} />
          {Array.from({ length: Math.ceil(w / 0.6) }, (_, n) => (
            <group key={n}>
              <Block
                p={[n * 0.58 + 0.285, 0.43, d + 0.008]}
                s={[0.56, 0.75, 0.025]}
                color={p.cabinet}
              />
              <Block
                p={[n * 0.58 + 0.285, 0.72, d + 0.03]}
                s={[0.22, 0.012, 0.024]}
                color="#72736b"
              />
            </group>
          ))}
          {box(w / 2, 1.87, 0.18, w, 0.72, 0.36, p.cabinet)}
          {Array.from({ length: Math.max(2, Math.floor(w / 0.8)) }, (_, n) => (
            <Block key={`upper-handle-${n}`} p={[0.35 + n * ((w - 0.7) / Math.max(1, Math.floor(w / 0.8) - 1)), 1.9, 0.38]} s={[0.18, 0.02, 0.025]} color="#29383b" metalness={0.65} roughness={0.26} />
          ))}
          <Block p={[w * 0.53, 0.43, d + 0.035]} s={[Math.min(0.58, w * 0.28), 0.55, 0.03]} color="#202a2e" roughness={0.22} metalness={0.12} />
          <Block p={[w * 0.53, 0.46, d + 0.055]} s={[Math.min(0.46, w * 0.21), 0.4, 0.012]} color="#111a1e" roughness={0.12} metalness={0.35} />
          <Block p={[w * 0.54, 2.22, d * 0.52]} s={[0.62, 0.16, 0.34]} color="#3a4547" metalness={0.68} roughness={0.25} round />
        </>
      );
      break;
    case "fridge":
      shape = (
        <>
          {box(w / 2, 1.03, d / 2, w, 2.06, d, "#ebece5")}
          {box(w / 2, 1.22, d + 0.008, w - 0.03, 0.012, 0.014, "#94998e")}
          {box(w - 0.07, 1.52, d + 0.04, 0.025, 0.38, 0.035, "#8c918a")}
        </>
      );
      break;
    case "sink":
    case "basin":
      shape = (
        <>
          {i.kind === "basin" && box(w / 2, 0.44, d / 2, w, 0.75, d, p.cabinet)}
          {box(w / 2, 0.88, d / 2, w, 0.07, d, "#f9f9f4", true)}
          {box(
            w / 2,
            0.92,
            d * 0.53,
            w * 0.72,
            0.008,
            d * 0.65,
            "#bfc9c7",
            true,
          )}
          {box(w / 2, 1.05, 0.06, 0.035, 0.3, 0.035, "#788c90")}
          {box(w / 2, 1.2, 0.13, 0.035, 0.035, 0.16, "#788c90")}
          {i.kind === "basin" && <><mesh position={[w / 2, 1.55, 0.035]}><boxGeometry args={[w * 0.78, 0.72, 0.035]} /><meshPhysicalMaterial color="#aebfc1" metalness={0.15} roughness={0.08} transmission={0.12} /></mesh><Block p={[w * 0.5, 1.16, d * 0.93]} s={[w * 0.82, 0.035, 0.035]} color="#2c3b3e" metalness={0.5} roughness={0.25} /></>}
        </>
      );
      break;
    case "hob":
      shape = (
        <>
          {box(w / 2, 0.889, d / 2, w, 0.016, d, "#18252b")}
          {[0.25, 0.75].flatMap((x) =>
            [0.25, 0.75].map((z) => (
              <mesh
                key={`${x}-${z}`}
                position={[w * x, 0.9, d * z]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <ringGeometry args={[0.066, 0.073, 24]} />
                <meshStandardMaterial color="#b2b8ba" />
              </mesh>
            )),
          )}
        </>
      );
      break;
    case "wardrobe":
      shape = (
        <>
          {box(w / 2, 1.12, d / 2, w, 2.24, d, "#e4dfd3")}
          {box(w / 2, 1.1, d + 0.02, 0.02, 2.1, 0.02, "#8e9187")}
        </>
      );
      break;
    case "shower":
      shape = (
        <>
          {box(w / 2, 0.012, d / 2, w, 0.025, d, "#c2c6c1")}
          {box(w * 0.5, 0.03, d * 0.5, 0.12, 0.015, 0.12, "#71827f")}
          <mesh position={[w, 1.05, d / 2]}>
            <boxGeometry args={[0.008, 2.1, d]} />
            <meshPhysicalMaterial
              color="#cce3df"
              transparent
              opacity={0.17}
              roughness={0.1}
              depthWrite={false}
            />
          </mesh>
          {box(0.1, 1.25, 0.05, 0.025, 0.9, 0.03, "#829295")}
          {box(0.1, 1.9, 0.16, 0.22, 0.035, 0.3, "#aeb7b5")}
          {box(0.1, 2.17, 0.17, 0.03, 0.48, 0.03, "#829295")}
          <mesh position={[0.1, 2.34, 0.27]}>
            <cylinderGeometry args={[0.11, 0.11, 0.025, 24]} />
            <meshStandardMaterial color="#aeb7b5" metalness={0.76} roughness={0.2} />
          </mesh>
          <Block p={[w * 0.98, 1.12, d * 0.5]} s={[0.035, 0.4, 0.035]} color="#48585b" metalness={0.58} roughness={0.24} />
        </>
      );
      break;
    case "wc":
      shape = (
        <>
          {box(w / 2, 0.4, 0.12, w, 0.68, 0.24, "#f5f6f3", true)}
          <mesh
            position={[w / 2, 0.29, d * 0.63]}
            scale={[w * 0.48, 0.28, d * 0.47]}
            castShadow
          >
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color="#f5f6f3" roughness={0.2} />
          </mesh>
          {box(w / 2, 0.49, d * 0.6, w, 0.04, d * 0.6, "#fcfdf9", true)}
        </>
      );
      break;
    case "washer":
      shape = (
        <>
          {box(w / 2, 0.43, d / 2, w, 0.85, d, "#f3f5f0")}
          <mesh
            position={[w / 2, 0.4, d + 0.015]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.21, 0.21, 0.03, 32]} />
            <meshStandardMaterial
              color="#374c55"
              metalness={0.4}
              roughness={0.15}
            />
          </mesh>
          {box(w / 2, 0.77, d + 0.018, w - 0.05, 0.08, 0.02, "#c1c8c7")}
        </>
      );
      break;
    case "bench":
      shape = (
        <>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <Block
              key={n}
              p={[w / 2, 0.85, 0.045 + n * 0.095]}
              s={[w, 0.065, 0.085]}
              color="white"
              map={wood}
            />
          ))}
          {box(w / 2, 0.4, d + 0.12, w, 0.07, 0.24, "white", false, wood)}
        </>
      );
      break;
    case "heater":
      shape = (
        <>
          {box(w / 2, 0.4, d / 2, w, 0.65, d, "#3c4646")}
          {Array.from({ length: 12 }, (_, n) => (
            <mesh
              key={n}
              position={[
                0.06 + (n % 4) * 0.1,
                0.74,
                Math.floor(n / 4) * 0.1 + 0.06,
              ]}
              castShadow
            >
              <dodecahedronGeometry args={[0.065]} />
              <meshStandardMaterial color="#68706b" roughness={1} />
            </mesh>
          ))}
        </>
      );
      break;
    case "stairs":
      shape = (
        <>
          {Array.from({ length: 9 }, (_, n) => (
            <Block
              key={n}
              p={[w / 2, 0.09 + n * 0.145, (d * (n + 0.5)) / 9]}
              s={[w, 0.18 + n * 0.005, d / 9 + 0.012]}
              color="#a98258"
              map={wood}
              roughness={0.58}
            />
          ))}
        </>
      );
      break;
  }
  return (
    <group position={[i.x / 1000, levelOffset, i.z / 1000]}>{shape}</group>
  );
}
function ArchitecturalWall({
  wall: w,
  height,
  wallColor,
  cutaway,
  interior,
  exteriorSurface,
  surface,
  levelOffset = 0,
}: {
  wall: Wall;
  height: number;
  wallColor: string;
  cutaway: boolean;
  interior: boolean;
  exteriorSurface: boolean;
  surface?: THREE.Texture;
  levelOffset?: number;
}) {
  const h = cutaway ? Math.min(height, 1.15) : height,
    o = w.opening,
    t = w.thickness / 1000;
  const wallMap = useMemo(() => {
    if (!surface) return undefined;
    const map = surface.clone();
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(
      exteriorSurface ? (w.end - w.start) / 1100 : (w.end - w.start) / 600,
      exteriorSurface ? h / 2.6 : h / 0.6,
    );
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    map.needsUpdate = true;
    return map;
  }, [surface, w.end, w.start, h, exteriorSurface]);
  useEffect(() => () => wallMap?.dispose(), [wallMap]);
  const box = (
    start: number,
    end: number,
    bottom: number,
    top: number,
    color = wallColor,
  ) =>
    top > bottom && end > start ? (
      <Block
        p={[(start + end) / 2000, (bottom + top) / 2, 0]}
        s={[(end - start) / 1000, top - bottom, t]}
        color={color}
        map={wallMap}
        roughness={surface ? 0.82 : 0.9}
      />
    ) : null;
  return (
    <group
      position={
        w.axis === "x"
          ? [0, levelOffset, w.at / 1000]
          : [w.at / 1000, levelOffset, 0]
      }
      rotation={[0, w.axis === "x" ? 0 : -Math.PI / 2, 0]}
    >
      {o ? (
        <>
          {box(w.start, o.start, 0, h)}
          {box(o.start + o.width, w.end, 0, h)}
          {box(o.start, o.start + o.width, 0, Math.min(h, o.sill / 1000))}
          {box(o.start, o.start + o.width, (o.sill + o.height) / 1000, h)}
          {o.kind === "window" && (
            <group position={[(o.start + o.width / 2) / 1000, 0, 0]}>
              <mesh
                position={[
                  0,
                  (o.sill / 1000 + Math.min(h, (o.sill + o.height) / 1000)) / 2,
                  0,
                ]}
              >
                <boxGeometry
                  args={[
                    o.width / 1000,
                    0.001 + Math.min(o.height / 1000, h - o.sill / 1000),
                    0.015,
                  ]}
                />
                <meshPhysicalMaterial
                  color="#b6d8e1"
                  transparent
                  opacity={0.24}
                  roughness={0.04}
                  metalness={0.05}
                  transmission={0.15}
                  ior={1.45}
                  depthWrite={false}
                />
              </mesh>
              {[o.sill / 1000, Math.min(h, (o.sill + o.height) / 1000)].map(
                (y) => (
                  <Block
                    key={y}
                    p={[0, y, 0]}
                    s={[o.width / 1000, 0.055, 0.13]}
                    color="#e4e2d9"
                  />
                ),
              )}
              {[-o.width / 2000, 0, o.width / 2000].map((x) => (
                <Block
                  key={x}
                  p={[
                    x,
                    (o.sill / 1000 + Math.min(h, (o.sill + o.height) / 1000)) /
                      2,
                    0,
                  ]}
                  s={[
                    0.055,
                    Math.max(
                      0.05,
                      Math.min(h - o.sill / 1000, o.height / 1000),
                    ),
                    0.13,
                  ]}
                  color="#dadbd3"
                />
              ))}
              {o.sill > 0 && (
                <Block
                  p={[0, 0.38, t / 2 + 0.08]}
                  s={[o.width / 1000 - 0.2, 0.45, 0.09]}
                  color="#e9e9e1"
                />
              )}
            </group>
          )}
          {o.kind === "door" && (
            <group
              position={[o.start / 1000, 0, 0]}
              rotation={[0, -Math.PI / 2, 0]}
            >
              <Block
                p={[o.width / 2000, Math.min(h, 2.05) / 2, 0]}
                s={[o.width / 1000 - 0.06, Math.min(h, 2.05), 0.035]}
                color="#dcd4c7"
              />
            </group>
          )}
        </>
      ) : (
        box(w.start, w.end, 0, h)
      )}
      {(o
        ? [
            [w.start, o.start],
            [o.start + o.width, w.end],
          ]
        : [[w.start, w.end]]
      ).map(([a, b], i) => (
        <group key={i}>
          {[-t / 2, t / 2].map((z) => (
            <Block
              key={z}
              p={[(a + b) / 2000, 0.045, z]}
              s={[(b - a) / 1000, 0.09, 0.025]}
              color="#d7d5c9"
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function Birch({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const crown = [
    [0, 3.65, 0, 0.78],
    [0.46, 4.05, 0.1, 0.63],
    [-0.42, 3.95, -0.1, 0.58],
    [0.18, 4.52, 0, 0.46],
  ] as const;
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 1.92, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.09, 3.84, 10]} />
        <meshStandardMaterial color="#e9e5dc" roughness={0.95} />
      </mesh>
      {[0.6, 1.42, 2.25, 3.1].map((y, index) => (
        <mesh
          key={y}
          position={[index % 2 ? 0.055 : -0.055, y, 0.072]}
          rotation={[0, 0.35, 0]}
        >
          <boxGeometry args={[0.14, 0.035, 0.012]} />
          <meshStandardMaterial color="#524e45" roughness={1} />
        </mesh>
      ))}
      {crown.map(([cx, cy, cz, radius], index) => (
        <mesh key={index} position={[cx, cy, cz]} castShadow>
          <sphereGeometry args={[radius, 12, 10]} />
          <meshStandardMaterial
            color={index % 2 ? "#839c73" : "#97ad82"}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function A12Exterior() {
  return (
    <group>
      <mesh position={[4, 4.1, -11]}>
        <planeGeometry args={[24, 11]} />
        <meshBasicMaterial color="#b6d1dc" side={THREE.DoubleSide} />
      </mesh>
      <mesh
        position={[4, -0.18, -6.4]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[26, 18]} />
        <meshStandardMaterial color="#849878" roughness={1} />
      </mesh>
      <Birch x={-0.3} z={-4.4} scale={1.08} />
      <Birch x={2.35} z={-5.5} scale={1.36} />
      <Birch x={5.15} z={-4.8} scale={0.95} />
      <Birch x={8.3} z={-6.1} scale={1.22} />
      <Birch x={10.1} z={-4.5} scale={0.88} />
      <mesh position={[9.1, 1.65, -7.2]}>
        <boxGeometry args={[3.2, 3.3, 0.25]} />
        <meshStandardMaterial color="#e7e5de" roughness={0.82} />
      </mesh>
      <mesh position={[9.1, 2.4, -7.05]}>
        <planeGeometry args={[2.5, 1.45]} />
        <meshStandardMaterial
          color="#c5d7d8"
          roughness={0.18}
          metalness={0.08}
        />
      </mesh>
    </group>
  );
}

/**
 * F20 gets a deliberately small exterior set instead of a second, unrelated
 * building.  The same terrace and timber context is visible in both empty and
 * furnished modes; only movable furniture is toggled below.  The backdrop is
 * an original concept render used as a distant WebGL texture, not a property
 * photograph or a panoramic capture.
 */
function F20Exterior({ windowView }: { windowView?: THREE.Texture }) {
  const view = useMemo(() => {
    if (!windowView) return undefined;
    const result = windowView.clone();
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 8;
    // Crop away the generated image's edge framing so the architectural window
    // remains the only frame the visitor reads in the tour.
    result.repeat.set(1.17, 1.08);
    result.offset.set(-0.085, -0.04);
    result.needsUpdate = true;
    return result;
  }, [windowView]);
  useEffect(() => () => view?.dispose(), [view]);
  return (
    <group>
      <mesh position={[2.6, 3.15, -8.1]}>
        <planeGeometry args={[18, 8.8]} />
        {view ? (
          <meshBasicMaterial map={view} toneMapped={false} />
        ) : (
          <meshBasicMaterial color="#b8ccd4" />
        )}
      </mesh>
      <mesh
        position={[4.6, -0.2, -4.65]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#7f9575" roughness={1} />
      </mesh>
      <mesh position={[2.6, 0.03, -2.95]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.5, 1.9]} />
        <meshStandardMaterial color="#a59d91" roughness={0.88} />
      </mesh>
      <mesh position={[-1.18, 1.1, -2.1]} castShadow>
        <boxGeometry args={[0.12, 2.2, 0.12]} />
        <meshStandardMaterial color="#29383a" metalness={0.28} roughness={0.53} />
      </mesh>
      <mesh position={[6.42, 1.1, -2.1]} castShadow>
        <boxGeometry args={[0.12, 2.2, 0.12]} />
        <meshStandardMaterial color="#29383a" metalness={0.28} roughness={0.53} />
      </mesh>
      <Birch x={-0.8} z={-4.45} scale={0.9} />
      <Birch x={3.4} z={-5.25} scale={1.12} />
      <Birch x={7.25} z={-4.8} scale={0.82} />
    </group>
  );
}

function A12FurnishedDetails({
  wood,
  linen,
}: {
  wood: THREE.Texture;
  linen?: THREE.Texture;
}) {
  return (
    <group>
      <group position={[3.82, 0, 3.64]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.19, 0.23, 0.24, 24]} />
          <meshStandardMaterial color="#c7b592" roughness={0.82} />
        </mesh>
        {[
          [-0.08, 0.48, 0],
          [0.08, 0.62, 0.03],
          [0, 0.76, -0.08],
          [0.16, 0.52, -0.08],
          [-0.16, 0.57, 0.08],
        ].map(([x, y, z], index) => (
          <mesh
            key={index}
            position={[x, y, z]}
            rotation={[index * 0.3, index, 0]}
            castShadow
          >
            <sphereGeometry args={[0.17, 10, 8]} />
            <meshStandardMaterial
              color={index % 2 ? "#5f7a61" : "#78916e"}
              roughness={1}
            />
          </mesh>
        ))}
      </group>
      <group position={[4.03, 0, 0.72]}>
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 1.7, 12]} />
          <meshStandardMaterial
            color="#3b4542"
            metalness={0.65}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, 1.75, 0]}>
          <cylinderGeometry args={[0.22, 0.18, 0.24, 18, 1, true]} />
          <meshStandardMaterial color="#ded8ca" map={linen} roughness={0.84} />
        </mesh>
      </group>
      <group position={[1.95, 0, 2.46]}>
        <mesh position={[0, 0.37, 0]}>
          <cylinderGeometry args={[0.31, 0.35, 0.025, 28]} />
          <meshStandardMaterial color="#d9c7a7" map={wood} roughness={0.48} />
        </mesh>
        <mesh position={[0, 0.47, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.19, 18]} />
          <meshStandardMaterial color="#e6e1d6" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.06, 12, 8]} />
          <meshStandardMaterial color="#71825f" roughness={1} />
        </mesh>
      </group>
      <group position={[1.45, 0, 5.98]}>
        {[
          [-0.38, 0, 0],
          [0.38, 0, 0],
        ].map(([x, y, z], index) => (
          <group key={index} position={[x, y, z]}>
            <mesh position={[0, 0.42, 0]}>
              <cylinderGeometry args={[0.035, 0.05, 0.84, 10]} />
              <meshStandardMaterial
                color="#77756d"
                metalness={0.25}
                roughness={0.5}
              />
            </mesh>
            <mesh position={[0, 0.87, 0]}>
              <sphereGeometry args={[0.18, 16, 10]} />
              <meshStandardMaterial
                color="#f3efe4"
                map={linen}
                roughness={0.86}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/** Extra low-poly detail set for the flagship F20 home. It is deliberately separate from
 * the architectural fittings: empty mode remains the same home, while furnished mode gets
 * only movable staging and exterior life. */
function F20FurnishedDetails({
  wood,
  linen,
  stone,
}: {
  wood: THREE.Texture;
  linen?: THREE.Texture;
  stone?: THREE.Texture;
}) {
  const leaves = (count: number, color: string) =>
    Array.from({ length: count }, (_, index) => {
      const angle = index * 1.91;
      return (
        <mesh
          key={index}
          position={[Math.cos(angle) * 0.18, 0.48 + (index % 4) * 0.11, Math.sin(angle) * 0.18]}
          rotation={[index * 0.41, angle, 0]}
          castShadow
        >
          <sphereGeometry args={[0.105, 10, 8]} />
          <meshStandardMaterial color={color} roughness={0.92} />
        </mesh>
      );
    });
  return (
    <group>
      <group position={[4.56, 0, 3.45]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.27, 0.32, 20]} />
          <meshStandardMaterial color="#bdab8c" roughness={0.82} />
        </mesh>
        {leaves(13, "#60765f")}
      </group>
      <group position={[2.2, 0, 3.75]}>
        <mesh position={[0, 0.95, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.035, 1.9, 12]} />
          <meshStandardMaterial color="#27363b" metalness={0.62} roughness={0.28} />
        </mesh>
        <mesh position={[0, 1.98, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.3, 20, 1, true]} />
          <meshStandardMaterial color="#e9dfc9" map={linen} roughness={0.86} />
        </mesh>
      </group>
      <group position={[2.25, 0, -1.14]}>
        <mesh position={[0, 0.43, 0]} castShadow>
          <cylinderGeometry args={[0.52, 0.56, 0.08, 28]} />
          <meshStandardMaterial color="#c9ae81" map={wood} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.14, 0.42, 14]} />
          <meshStandardMaterial color="#304145" metalness={0.5} roughness={0.35} />
        </mesh>
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => (
          <group key={angle} position={[Math.cos(angle) * 0.92, 0, Math.sin(angle) * 0.92]} rotation={[0, -angle, 0]}>
            <Block p={[0, 0.48, 0]} s={[0.52, 0.08, 0.5]} color="#a9b4a1" round map={linen} />
            <Block p={[0, 0.75, 0.2]} s={[0.52, 0.52, 0.07]} color="#a9b4a1" round map={linen} />
            {[-0.2, 0.2].map((x) => <Block key={x} p={[x, 0.24, 0]} s={[0.035, 0.48, 0.035]} color="#314247" metalness={0.5} roughness={0.38} />)}
          </group>
        ))}
      </group>
      <group position={[.62, 0, -1.35]}>
        <mesh position={[0, 0.14, 0]} castShadow>
          <cylinderGeometry args={[0.19, 0.24, 0.28, 18]} />
          <meshStandardMaterial color="#d1c8b5" roughness={0.84} />
        </mesh>
        {leaves(10, "#788c69")}
      </group>
      <group position={[6.95, 0, 1.52]}>
        <Block p={[0, 0.45, 0]} s={[1.42, 0.86, 0.82]} color="#c8b394" round />
        <Block p={[0, 0.91, 0]} s={[1.5, 0.055, 0.9]} color="#eee9df" map={stone} roughness={0.26} />
        <Block p={[0, 0.84, -0.34]} s={[0.46, 0.12, 0.11]} color="#1d282b" roughness={0.16} metalness={0.42} round />
        {[-0.46, 0.46].map((x) => <group key={x} position={[x, 0, 0.78]}><Block p={[0, 0.32, 0]} s={[0.12, 0.58, 0.12]} color="#28363a" metalness={0.58} roughness={0.28} /><Block p={[0, 0.63, 0]} s={[0.34, 0.07, 0.34]} color="#b7c1b3" round map={linen} /></group>)}
      </group>
      <group position={[2.75, 0, 2.5]}>
        <mesh position={[0, 2.05, 0]}><cylinderGeometry args={[0.018, 0.024, 1.08, 10]} /><meshStandardMaterial color="#27363b" metalness={0.66} roughness={0.24} /></mesh>
        <mesh position={[0, 1.47, 0]}><cylinderGeometry args={[0.3, 0.22, 0.18, 20, 1, true]} /><meshStandardMaterial color="#e9e1d2" map={linen} roughness={0.82} /></mesh>
        <pointLight position={[0, 1.42, 0]} color="#ffddad" intensity={5.4} distance={3.5} decay={2} />
      </group>
      <group position={[4.95, 1.42, 3.84]} rotation={[0, Math.PI / 2, 0]}>
        <Block p={[0, 0, 0]} s={[1.05, 0.74, 0.045]} color="#31484d" roughness={0.52} />
        <Block p={[0, 0, 0.028]} s={[0.87, 0.56, 0.02]} color="#d9cbb2" roughness={0.8} />
      </group>
    </group>
  );
}
/** Staging is positioned relative to each room; fixed architecture never moves. */
function RoomStaging({ design, level, wood, linen }: { design: Design; level?: number; wood: THREE.Texture; linen?: THREE.Texture }) {
  return <>{design.rooms.filter(r => (level === undefined || r.level === level) && ["living", "bedroom"].includes(r.kind)).map(r => {
    const y = ((r.level ?? 1) - 1) * (design.height / 1000 + .22);
    return <group key={r.id} position={[r.x / 1000, y, r.z / 1000]}>
      <group position={[.35, 0, r.d / 1000 - .4]}>
        <mesh position={[0, .18, 0]} castShadow><cylinderGeometry args={[.18, .14, .36, 32]}/><meshStandardMaterial color="#c4b196" roughness={.8}/></mesh>
        <mesh position={[0, .62, 0]}><cylinderGeometry args={[.012, .015, .6, 8]}/><meshStandardMaterial color="#506340"/></mesh>
        {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[Math.sin(i * 2.4) * .15, .48 + i * .05, Math.cos(i * 2.4) * .15]} rotation={[.4, i * 2.4, .7]} scale={[1, .12, 2]} castShadow><sphereGeometry args={[.13, 12, 8]}/><meshStandardMaterial color={i % 2 ? "#4d6949" : "#73875b"} roughness={.9}/></mesh>)}
      </group>
      {r.kind === "bedroom" && <group position={[2, 0, .55]}>
        <Block p={[0, .3, 0]} s={[.38, .6, .42]} map={wood} color="white" round/>
        <mesh position={[0, .83, 0]} castShadow><cylinderGeometry args={[.13, .16, .24, 32]}/><meshStandardMaterial color="#ede4d1" map={linen}/></mesh>
        <Block p={[0, .68, 0]} s={[.035, .2, .035]} color="#343e39" metalness={.65}/>
      </group>}
      {r.kind === "living" && <group position={[r.w / 1000 - .35, 0, .55]}>
        <mesh position={[0, .92, 0]}><cylinderGeometry args={[.015, .022, 1.84, 16]}/><meshStandardMaterial color="#303732" metalness={.6} roughness={.3}/></mesh>
        <mesh position={[0, 1.85, 0]}><coneGeometry args={[.25, .24, 32, 1, true]}/><meshStandardMaterial color="#e0d5be" side={THREE.DoubleSide} map={linen}/></mesh>
        <mesh position={[0, .025, 0]}><cylinderGeometry args={[.17, .17, .05, 32]}/><meshStandardMaterial color="#303732"/></mesh>
      </group>}
    </group>;
  })}</>;
}

function Handrail({
  from,
  to,
  z,
}: {
  from: [number, number];
  to: [number, number];
  z: number;
}) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  return (
    <>
      <mesh
        position={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, z]}
        rotation={[0, 0, angle]}
        castShadow
      >
        <boxGeometry args={[length, 0.045, 0.045]} />
        <meshStandardMaterial color="#27363b" metalness={0.62} roughness={0.3} />
      </mesh>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const x = from[0] + dx * t;
        const y = from[1] + dy * t - 0.45;
        return (
          <mesh key={t} position={[x, y, z]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.9, 8]} />
            <meshStandardMaterial color="#27363b" metalness={0.62} roughness={0.3} />
          </mesh>
        );
      })}
    </>
  );
}

/** Two connected flights with a landing replace the former decorative blocks.
 * The geometry is shared by the room plan and the real-time duplex model. */
function DuplexStaircase({
  design,
  wood,
}: {
  design: Design;
  wood: THREE.Texture;
}) {
  const profile = stairProfile(design);
  if (!profile) return null;
  const { room } = profile;
  const roomWidth = room.w / 1000;
  const roomDepth = room.d / 1000;
  const flightSteps = profile.steps;
  const rise = (design.height / 1000 + 0.22) / (flightSteps * 2);
  const run = profile.run;
  const tread = run / flightSteps;
  const start = profile.start;
  const landingWidth = roomWidth - start - run;
  const flightWidth = profile.flightWidth;
  const farLane = profile.farLane;
  const nearLane = profile.nearLane;
  const landingHeight = flightSteps * rise;
  const topHeight = flightSteps * 2 * rise;
  const stairMaterial = "#c6a57d";
  return (
    <group position={[room.x / 1000, 0, room.z / 1000]}>
      {Array.from({ length: flightSteps }, (_, index) => (
        <Block
          key={`up-${index}`}
          p={[
            start + tread * (index + 0.5),
            ((index + 1) * rise) / 2,
            nearLane,
          ]}
          s={[tread + 0.012, (index + 1) * rise, flightWidth]}
          color={stairMaterial}
          map={wood}
          roughness={0.5}
        />
      ))}
      <Block
        p={[start + run + landingWidth / 2, landingHeight - 0.035, roomDepth / 2]}
        s={[landingWidth, 0.07, roomDepth - 0.1]}
        color={stairMaterial}
        map={wood}
        roughness={0.5}
      />
      {Array.from({ length: flightSteps }, (_, index) => (
        <Block
          key={`return-${index}`}
          p={[
            start + run - tread * (index + 0.5),
            ((flightSteps + index + 1) * rise) / 2,
            farLane,
          ]}
          s={[tread + 0.012, (flightSteps + index + 1) * rise, flightWidth]}
          color={stairMaterial}
          map={wood}
          roughness={0.5}
        />
      ))}
      <Handrail from={[start, 0.9]} to={[start + run, landingHeight + 0.9]} z={0.07} />
      <Handrail from={[start + run, landingHeight + 0.9]} to={[start, topHeight + 0.9]} z={roomDepth - 0.07} />
    </group>
  );
}

type ModelProps = {
  design: Design;
  style?: InteriorStyle;
  furnished?: boolean;
  cutaway?: boolean;
  interior?: boolean;
  lighting?: TourLighting;
  level?: number;
};

function RoomFloor({
  x,
  z,
  width,
  depth,
  texture,
  tiled,
  y = 0,
}: {
  x: number;
  z: number;
  width: number;
  depth: number;
  texture: THREE.Texture;
  tiled: boolean;
  y?: number;
}) {
  const map = useMemo(() => {
    const result = texture.clone();
    result.wrapS = result.wrapT = THREE.RepeatWrapping;
    // Keep the same board/tile scale in every room, independent of room size.
    result.repeat.set(width / (tiled ? 1.2 : 1.6), depth / (tiled ? 1.2 : 1.6));
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 8;
    result.needsUpdate = true;
    return result;
  }, [texture, width, depth, tiled]);
  useEffect(() => () => map.dispose(), [map]);
  return (
    <mesh
      position={[x, y + 0.007, z]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial map={map} roughness={tiled ? 0.78 : 0.57} />
    </mesh>
  );
}

function BaseModel({
  design,
  style = "nordic",
  furnished = true,
  cutaway = false,
  interior = false,
  lighting = "day",
  level,
  oak,
  a12Tile,
  a12Linen,
  windowView,
  quartz,
  timber,
}: ModelProps & {
  oak?: THREE.Texture;
  a12Tile?: THREE.Texture;
  a12Linen?: THREE.Texture;
  windowView?: THREE.Texture;
  quartz?: THREE.Texture;
  timber?: THREE.Texture;
}) {
  const palette = styles[style];
  const proceduralWood = useSurface("wood", palette.wood),
    tile = useSurface("tile", "#cbc9c0");
  const wood = oak ?? proceduralWood,
    bathroomTile = a12Tile ?? tile;
  const storeyOffset = design.height / 1000 + 0.22;
  return (
    <group>
      {(level === undefined || level === 1) && <Block
        p={[design.width / 2000, -0.12, design.depth / 2000]}
        s={[design.width / 1000 + 0.3, 0.22, design.depth / 1000 + 0.3]}
        color="#cecfc7"
      />}
      {design.rooms.filter(r => level === undefined || (r.level ?? 1) === level).map((r) => {
        const levelOffset = ((r.level ?? 1) - 1) * storeyOffset;
        return (
          <group key={r.id}>
            <RoomFloor
              x={r.code === "PORRAS" && r.level === 2 ? r.x / 1000 + .325 : (r.x + r.w / 2) / 1000}
              z={(r.z + r.d / 2) / 1000}
              width={r.code === "PORRAS" && r.level === 2 ? .65 : r.w / 1000}
              depth={r.d / 1000}
              texture={r.kind === "bathroom" ? bathroomTile : wood}
              tiled={r.kind === "bathroom"}
              y={levelOffset}
            />
            {interior && !(design.levels > 1 && r.code === "PORRAS" && (r.level ?? 1) === 1) && (
              <mesh
                position={[
                  (r.x + r.w / 2) / 1000,
                  levelOffset + design.height / 1000,
                  (r.z + r.d / 2) / 1000,
                ]}
                rotation={[Math.PI / 2, 0, 0]}
                receiveShadow
              >
                <planeGeometry args={[r.w / 1000, r.d / 1000]} />
                <meshStandardMaterial color="#f6f3eb" />
              </mesh>
            )}
            {interior && (
              <pointLight
                position={[
                  (r.x + r.w / 2) / 1000,
                  levelOffset + 2.38,
                  (r.z + r.d / 2) / 1000,
                ]}
                color={r.kind === "sauna" ? "#ffcd83" : "#fff0d8"}
                intensity={r.kind === "sauna" ? (lighting === "evening" ? 8 : 5) : lighting === "evening" ? 17 : 7}
                distance={6}
                decay={2}
              />
            )}
            {interior && (
              <mesh
                position={[
                  (r.x + r.w / 2) / 1000,
                  levelOffset + 2.56,
                  (r.z + r.d / 2) / 1000,
                ]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <circleGeometry args={[0.16, 24]} />
                <meshStandardMaterial
                  color="#fff5d7"
                  emissive="#fff3d3"
                  emissiveIntensity={lighting === "evening" ? 4.5 : 1.6}
                />
              </mesh>
            )}
          </group>
        );
      })}
      {design.walls.filter(w => level === undefined || (w.level ?? 1) === level).map((w) => (
        <ArchitecturalWall
          key={w.id}
          wall={w}
          height={design.height / 1000}
          wallColor={w.rooms.includes("s") ? "#c1a27b" : palette.wall}
          cutaway={cutaway}
          interior={interior}
          exteriorSurface={!interior && w.rooms.length === 1 && !!timber}
          surface={!interior && w.rooms.length === 1 ? timber : a12Tile && w.rooms.some((roomId) => design.rooms.find((room) => room.id === roomId)?.kind === "bathroom") ? bathroomTile : undefined}
          levelOffset={((w.level ?? 1) - 1) * storeyOffset}
        />
      ))}
      {design.fittings
        .filter((f) => (level === undefined || (f.level ?? 1) === level) && (furnished || f.fixed) && !(design.levels > 1 && f.kind === "stairs"))
        .map((f) => (
          <Furniture
            key={f.id}
            item={f}
            style={style}
            wood={wood}
            linen={a12Linen}
            stone={quartz}
            levelOffset={((f.level ?? 1) - 1) * storeyOffset}
          />
        ))}
      <group position={[design.outdoor.x / 1000, 0, design.outdoor.z / 1000]}>
        <Block
          p={[design.outdoor.w / 2000, -0.045, design.outdoor.d / 2000]}
          s={[design.outdoor.w / 1000, 0.08, design.outdoor.d / 1000]}
          color="white"
          map={wood}
        />
        {!design.outdoor.terrace && (
          <>
            <Block
              p={[design.outdoor.w / 2000, 1.05, 0.04]}
              s={[design.outdoor.w / 1000, 0.04, 0.04]}
              color="#596f75"
            />
            <mesh position={[design.outdoor.w / 2000, 0.55, 0.04]}>
              <boxGeometry args={[design.outdoor.w / 1000, 1, 0.012]} />
              <meshPhysicalMaterial
                color="#9cbdc5"
                transparent
                opacity={0.3}
                roughness={0.12}
                depthWrite={false}
              />
            </mesh>
          </>
        )}
      </group>
      {design.id === "A12" && <A12Exterior />}
      {["C09", "E15", "F20"].includes(design.id) && <F20Exterior windowView={windowView} />}
      {design.levels > 1 && <DuplexStaircase design={design} wood={wood} />}
      {design.id === "A12" && furnished && (
        <A12FurnishedDetails wood={wood} linen={a12Linen} />
      )}
      {furnished && <RoomStaging design={design} level={level} wood={wood} linen={a12Linen} />}
    </group>
  );
}

function TexturedHome(props: ModelProps) {
  const [oak, tile, linen, windowView, quartz, timber] = useTexture([
    "/art/material-oak-parquet-v3.webp",
    "/art/material-porcelain-tile-v3.webp",
    "/art/material-linen-weave-v3.webp",
    "/art/kalliolinna-f20-window-view-v2.webp",
    "/art/material-quartz-worktop-v3.webp",
    "/art/material-charcoal-timber-v3.webp",
  ]);
  return <BaseModel {...props} oak={oak} a12Tile={tile} a12Linen={linen} windowView={windowView} quartz={quartz} timber={timber} />;
}

export function ArchitecturalModel(props: ModelProps) {
  return <Suspense fallback={<BaseModel {...props} />}><TexturedHome {...props} /></Suspense>;
}
