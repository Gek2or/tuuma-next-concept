"use client";
import { Suspense, useEffect, useMemo } from "react";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Design, Fitting, Wall } from "@/lib/architecture";
export type InteriorStyle = "nordic" | "clay" | "forest";
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
  levelOffset = 0,
}: {
  item: Fitting;
  style: InteriorStyle;
  wood: THREE.Texture;
  linen?: THREE.Texture;
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
        </>
      );
      break;
    case "rug":
      shape = box(w / 2, 0.012, d / 2, w, 0.018, d, "#d6cbbc", true);
      break;
    case "table":
      shape = (
        <>
          {box(w / 2, 0.74, d / 2, w, 0.06, d, "white", true, wood)}
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
          {box(w / 2, 0.85, d / 2, w + 0.02, 0.045, d + 0.04, "#e6e0d4", false)}
          {box(w / 2, 1.18, 0.02, w, 0.6, 0.03, "#ede8df")}
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
  surface,
  levelOffset = 0,
}: {
  wall: Wall;
  height: number;
  wallColor: string;
  cutaway: boolean;
  surface?: THREE.Texture;
  levelOffset?: number;
}) {
  const h = cutaway ? Math.min(height, 1.15) : height,
    o = w.opening,
    t = w.thickness / 1000;
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
        map={surface}
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
}: {
  wood: THREE.Texture;
  linen?: THREE.Texture;
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
    </group>
  );
}
type ModelProps = {
  design: Design;
  style?: InteriorStyle;
  furnished?: boolean;
  cutaway?: boolean;
  interior?: boolean;
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
  oak,
  a12Tile,
  a12Linen,
  windowView,
}: ModelProps & {
  oak?: THREE.Texture;
  a12Tile?: THREE.Texture;
  a12Linen?: THREE.Texture;
  windowView?: THREE.Texture;
}) {
  const palette = styles[style];
  const proceduralWood = useSurface("wood", palette.wood),
    tile = useSurface("tile", "#cbc9c0");
  const wood = oak ?? proceduralWood,
    bathroomTile = a12Tile ?? tile;
  const storeyOffset = design.height / 1000 + 0.22;
  return (
    <group>
      <Block
        p={[design.width / 2000, -0.12, design.depth / 2000]}
        s={[design.width / 1000 + 0.3, 0.22, design.depth / 1000 + 0.3]}
        color="#cecfc7"
      />
      {design.rooms.map((r) => {
        const levelOffset = ((r.level ?? 1) - 1) * storeyOffset;
        return (
          <group key={r.id}>
            <RoomFloor
              x={(r.x + r.w / 2) / 1000}
              z={(r.z + r.d / 2) / 1000}
              width={r.w / 1000}
              depth={r.d / 1000}
              texture={r.kind === "bathroom" ? bathroomTile : wood}
              tiled={r.kind === "bathroom"}
              y={levelOffset}
            />
            {interior && (
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
                intensity={r.kind === "sauna" ? 5 : 9}
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
                  emissiveIntensity={2}
                />
              </mesh>
            )}
          </group>
        );
      })}
      {design.walls.map((w) => (
        <ArchitecturalWall
          key={w.id}
          wall={w}
          height={design.height / 1000}
          wallColor={w.rooms.includes("s") ? "#c1a27b" : palette.wall}
          cutaway={cutaway}
          surface={
            a12Tile && w.rooms.includes("kph") ? bathroomTile : undefined
          }
          levelOffset={((w.level ?? 1) - 1) * storeyOffset}
        />
      ))}
      {design.fittings
        .filter((f) => furnished || f.fixed)
        .map((f) => (
          <Furniture
            key={f.id}
            item={f}
            style={style}
            wood={wood}
            linen={a12Linen}
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
      {design.id === "F20" && <F20Exterior windowView={windowView} />}
      {design.id === "A12" && furnished && (
        <A12FurnishedDetails wood={wood} linen={a12Linen} />
      )}
      {design.id === "F20" && furnished && (
        <F20FurnishedDetails wood={wood} linen={a12Linen} />
      )}
    </group>
  );
}

function TexturedKalliolinna(props: ModelProps) {
  const [oak, tile, linen, windowView] = useTexture([
    "/art/a12-oak-albedo.webp",
    "/art/a12-bathroom-tile-albedo.webp",
    "/art/a12-linen-albedo.webp",
    "/art/kalliolinna-f20-window-view-v2.webp",
  ]);
  return <BaseModel {...props} oak={oak} a12Tile={tile} a12Linen={linen} windowView={windowView} />;
}

export function ArchitecturalModel(props: ModelProps) {
  return ["A12", "C09", "E15", "F20"].includes(props.design.id) ? (
    <Suspense fallback={<BaseModel {...props} />}>
      <TexturedKalliolinna {...props} />
    </Suspense>
  ) : (
    <BaseModel {...props} />
  );
}
