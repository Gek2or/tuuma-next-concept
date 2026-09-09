"use client";
import { useRef, useState } from "react";
import { Download, Minus, Plus, Printer } from "lucide-react";
import {
  designFor,
  roomArea,
  roomNames,
  stairProfile,
  type Design,
  type Fitting,
} from "@/lib/architecture";
import { useLanguage } from "./LanguageProvider";
function Symbol({ item: i }: { item: Fitting }) {
  const { w, d, kind } = i;
  return (
    <g
      transform={`translate(${i.x} ${i.z})`}
      stroke="#839097"
      strokeWidth="18"
      fill="none"
    >
      <rect
        width={w}
        height={d}
        rx={kind === "table" ? 120 : 30}
        fill={i.fixed ? "#f0f1ed" : "#fff"}
        strokeDasharray={kind === "rug" ? "30 35" : undefined}
      />
      {kind === "bed" && (
        <>
          <path d={`M0 480H${w} M0 ${d - 280}H${w}`} />
          <rect x="80" y="70" width={w / 2 - 120} height="320" rx="60" />
          <rect
            x={w / 2 + 40}
            y="70"
            width={w / 2 - 120}
            height="320"
            rx="60"
          />
        </>
      )}
      {kind === "sofa" && (
        <path
          d={`M160 0V${d} M${w - 160} 0V${d} M0 240H${w} M${w / 2} 240V${d}`}
        />
      )}
      {kind === "shower" && (
        <>
          <path d={`M0 0L${w} ${d} M${w} 0L0 ${d}`} />
          <circle cx={w / 2} cy={d / 2} r="60" />
        </>
      )}
      {kind === "wc" && (
        <>
          <rect x="30" y="25" width={w - 60} height="150" />
          <ellipse cx={w / 2} cy={d * 0.64} rx={w * 0.35} ry={d * 0.26} />
        </>
      )}
      {(kind === "sink" || kind === "basin") && (
        <ellipse cx={w / 2} cy={d / 2} rx={w * 0.36} ry={d * 0.3} />
      )}
      {kind === "hob" &&
        [0.28, 0.72].flatMap((x) =>
          [0.28, 0.72].map((y) => (
            <circle key={`${x}-${y}`} cx={w * x} cy={d * y} r="75" />
          )),
        )}
      {kind === "washer" && <circle cx={w / 2} cy={d / 2} r={w * 0.3} />}
      {(kind === "fridge" || kind === "wardrobe") && (
        <path d={`M0 0L${w} ${d} M${w} 0L0 ${d}`} />
      )}
      {kind === "bench" &&
        Array.from({ length: 5 }, (_, n) => (
          <path key={n} d={`M0 ${100 + n * 100}H${w}`} />
        ))}
      {kind === "stairs" &&
        <><path d={`M${w * .16} ${d / 2}H${w * .78} M${w * .78} 0V${d}`}/>{Array.from({ length: 9 }, (_, n) => <path key={n} d={`M${w * .16 + n * w * .62 / 9} 0V${d}`}/>)}<path d={`M${w * .18} ${d * .25}H${w * .9}V${d * .75}H${w * .18}l120 -90m-120 90l120 90`} stroke="#394768" strokeWidth="25"/></>}
      {["washer", "fridge", "wardrobe", "heater"].includes(kind) && (
        <text
          x={w / 2}
          y={d * 0.6}
          textAnchor="middle"
          fontSize="130"
          fill="#52636e"
          stroke="none"
        >
          {
            (
              {
                washer: "PK",
                fridge: "JK/PA",
                wardrobe: "SK",
                heater: "KI",
              } as Partial<Record<Fitting["kind"], string>>
            )[kind]
          }
        </text>
      )}
    </g>
  );
}
function Dimension({
  x1,
  y1,
  x2,
  y2,
  label,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
}) {
  const vertical = x1 === x2;
  return (
    <g stroke="#5b6870" strokeWidth="12" fill="#3e4d56">
      <path
        d={`M${x1} ${y1}L${x2} ${y2} M${x1 - 70} ${y1 + 70}L${x1 + 70} ${y1 - 70} M${x2 - 70} ${y2 + 70}L${x2 + 70} ${y2 - 70}`}
      />
      <text
        transform={`translate(${(x1 + x2) / 2 - (vertical ? 110 : 0)} ${(y1 + y2) / 2 - (vertical ? 0 : 100)}) rotate(${vertical ? -90 : 0})`}
        textAnchor="middle"
        fontSize="180"
        stroke="none"
      >
        {label ??
          Math.round(Math.hypot(x2 - x1, y2 - y1)).toLocaleString("fi-FI")}
      </text>
    </g>
  );
}
export function PlanGeometry({
  design,
  furnished = false,
  active,
  select,
  labels = true,
  level = 1,
}: {
  design: Design;
  furnished?: boolean;
  active?: string;
  select?: (id: string) => void;
  labels?: boolean;
  level?: number;
}) {
  const { text } = useLanguage();
  const rooms = design.rooms.filter((room) => (room.level ?? 1) === level);
  const walls = design.walls.filter((wall) => (wall.level ?? 1) === level);
  return (
    <g>
      {level === 1 && (
        <>
          <rect
            x={design.outdoor.x}
            y={design.outdoor.z}
            width={design.outdoor.w}
            height={design.outdoor.d}
            fill="#f4f5f1"
            stroke="#9da9a9"
            strokeWidth="35"
          />
          {labels && (
            <text
              x={design.outdoor.x + design.outdoor.w / 2}
              y={design.outdoor.z + design.outdoor.d / 2}
              textAnchor="middle"
              fontSize="210"
              fill="#5d727a"
            >
              {design.outdoor.terrace ? "TERASSI" : "PARVEKE"}
            </text>
          )}
        </>
      )}
      {rooms.map((room) => {
        const labelScale = Math.min(1, room.w / 1800, room.d / 1500);
        const showArea = labelScale > .73;
        const labelWidth = Math.min(980, Math.max(480, room.w - 260));
        const labelHeight = showArea ? 520 : 300;
        const labelY = room.z + room.d / 2 - labelHeight / 2;
        return <g
          key={room.id}
          role={select ? "button" : undefined}
          tabIndex={select ? 0 : undefined}
          aria-label={`${room.code} ${text(roomNames[room.kind])}`}
          onClick={() => select?.(room.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              select?.(room.id);
            }
          }}
          style={{ cursor: select ? "pointer" : undefined }}
        >
          <rect
            x={room.x}
            y={room.z}
            width={room.w}
            height={room.d}
            fill={
              room.id === active
                ? "#e2edf4"
                : room.kind === "bathroom"
                  ? "#edf0ef"
                  : room.kind === "sauna"
                    ? "#eee5d6"
                    : "#fff"
            }
          />
          {design.fittings
            .filter((i) => i.room === room.id && i.kind !== 'stairs' && (furnished || i.fixed))
            .map((i) => (
              <Symbol key={i.id} item={i} />
            ))}
          {room.code === 'PORRAS' && (() => {
            const stair = stairProfile(design);
            if (!stair) return null;
            const start = stair.start * 1000, end = (stair.start + stair.run) * 1000;
            const near = stair.nearLane * 1000, far = stair.farLane * 1000;
            const half = stair.flightWidth * 500;
            return <g transform={`translate(${room.x} ${room.z})`} fill="none" stroke="#596578" strokeWidth="18">
              <path d={`M${start} ${near-half}H${room.w-50}V${far+half}H${start} M${start} ${near+half}H${end}V${far-half}H${start}`}/>
              {Array.from({length: stair.steps + 1}, (_, n) => <path key={n} d={`M${start+n*stair.tread*1000} ${near-half}V${near+half} M${start+n*stair.tread*1000} ${far-half}V${far+half}`}/>)}
              <path d={`M${start} ${near}H${end+375}V${far}H${start}l130 -90m-130 90l130 90`} stroke="#22264b" strokeWidth="26"/>
            </g>;
          })()}
          {labels && (
            <g pointerEvents="none">
              <rect
                x={room.x + room.w / 2 - labelWidth / 2}
                y={labelY}
                width={labelWidth}
                height={labelHeight}
                rx="55"
                fill="white"
                fillOpacity=".92"
              />
              <text
                x={room.x + room.w / 2}
                y={labelY + (showArea ? 210 : 195)}
                textAnchor="middle"
                fontSize={showArea ? "235" : "180"}
                fontWeight="600"
                fill="#1e3546"
              >
                {room.code}
              </text>
              {showArea && <text
                x={room.x + room.w / 2}
                y={labelY + 405}
                textAnchor="middle"
                fontSize="165"
                fill="#526571"
              >
                {roomArea(room).toFixed(1)} m²*
              </text>}
            </g>
          )}
        </g>;
      })}
      {walls.map((w) => {
        const o = w.opening;
        return (
          <g
            key={w.id}
            transform={
              w.axis === "x"
                ? `translate(0 ${w.at})`
                : `translate(${w.at} 0) rotate(90)`
            }
          >
            {(o
              ? [
                  [w.start, o.start],
                  [o.start + o.width, w.end],
                ]
              : [[w.start, w.end]]
            ).map(([start, end], i) => (
              <rect
                key={i}
                x={start}
                y={-w.thickness / 2}
                width={end - start}
                height={w.thickness}
                fill={w.rooms.length === 1 ? "#29383f" : "#4a565a"}
              />
            ))}
            {o && o.kind === "window" && (
              <g stroke="#617d8a" strokeWidth="18" fill="none">
                <rect
                  x={o.start}
                  y={-w.thickness / 2}
                  width={o.width}
                  height={w.thickness}
                />
                <path
                  d={`M${o.start} -45H${o.start + o.width} M${o.start} 45H${o.start + o.width} M${o.start + o.width / 2} ${-w.thickness / 2}V${w.thickness / 2}`}
                />
              </g>
            )}
            {o && o.kind === "door" && (
              <g fill="none" stroke="#697b82" strokeWidth="16">
                <path d={`M${o.start} 0V${o.width} M${o.start} ${o.width}A${o.width} ${o.width} 0 0 0 ${o.start + o.width} 0`} />
                <path d={`M${o.start} 0h${o.width}`} strokeDasharray="42 38" stroke="#9eabb0" />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

function SectionDrawing({ design }: { design: Design }) {
  const floorThickness = 220;
  const storeyRise = design.height + floorThickness;
  const top = -((design.levels - 1) * storeyRise + floorThickness);
  const baseline = design.levels > 1 ? 10400 : 5000;
  const crossLine = design.depth * .48;
  return <g transform={`translate(1700 ${baseline})`}>
    <rect x="-150" y={top} width={design.width + 300} height={2600 - top + 300} fill="#f8f8f4" stroke="#394950" strokeWidth="300" />
    {Array.from({ length: design.levels }, (_, index) => {
      const level = index + 1;
      const y = -(level - 1) * storeyRise;
      return <g key={level}>
        <rect x="-150" y={y + design.height} width={design.width + 300} height={floorThickness} fill="#a3a6a3" />
        {design.walls
          .filter((wall) => (wall.level ?? 1) === level && wall.axis === "z" && wall.rooms.length === 2 && wall.start <= crossLine && wall.end >= crossLine)
          .map((wall) => <rect key={wall.id} x={wall.at - 60} y={y} width="120" height={design.height} fill="#687477" />)}
        <text x="250" y={y + 360} fontSize="220" fill="#546b77">TASO {level}</text>
        <text x="250" y={y + 620} fontSize="165" fill="#70808a">VAPAA KORKEUS 2 600</text>
      </g>;
    })}
    <Dimension x1={-650} y1={0} x2={-650} y2={2600} label="2 600" />
    <Dimension x1={0} y1={3000} x2={design.width} y2={3000} />
    <text x="400" y="2350" fontSize="200" fill="#546b77">±0.000</text>
    <text x="0" y="3900" fontSize="210" fill="#546b77">Periaateleikkaus · tasot {design.levels}; rakenteet ja kantavuus eivät ole suunniteltuja.</text>
  </g>;
}
export function ApartmentPlan({
  initialApartment = "A12",
}: {
  initialApartment?: string;
}) {
  const { text } = useLanguage();
  const design = designFor(initialApartment);
  const [active, setActive] = useState("oh"),
    [furnished, setFurnished] = useState(false),
    [view, setView] = useState<"plan" | "section">("plan"),
    [zoom, setZoom] = useState(1),
    [level, setLevel] = useState(1);
  const svg = useRef<SVGSVGElement>(null);
  const visibleRooms = design.rooms.filter(
    (item) => (item.level ?? 1) === level,
  );
  const room =
    visibleRooms.find((item) => item.id === active) ?? visibleRooms[0];
  const copy = (fi: string, en: string, sv: string) => text({ fi, en, sv });
  const source = () =>
    svg.current ? new XMLSerializer().serializeToString(svg.current) : "";
  function download() {
    const url = URL.createObjectURL(
      new Blob([source()], { type: "image/svg+xml" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tuuma-${design.id}-ARK-${view === "plan" ? "101" : "201"}-A3.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function print() {
    const frame = document.createElement("iframe");
    frame.style.cssText = "position:fixed;width:0;height:0;border:0";
    frame.srcdoc = `<!doctype html><html><head><title>Tuuma ${design.id} ARK</title><style>@page{size:A3 landscape;margin:0}body{margin:0}svg{width:420mm;height:297mm}</style></head><body>${source()}</body></html>`;
    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      setTimeout(() => frame.remove(), 60000);
    };
    document.body.appendChild(frame);
  }
  return (
    <section className="overflow-hidden rounded-3xl border border-[#d7dfe0] bg-white text-[#173655]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b p-5 sm:p-7">
        <div>
          <p className="text-xs font-bold tracking-[.18em] text-slate-500">
            ARK / {design.id} / REV B{" "}
            {design.levels > 1 ? ` / TASO ${level}` : ""}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {copy("Pohja ja leikkaus", "Plan & section", "Plan och sektion")} ·{" "}
            {design.name}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={download}
            className="flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold"
          >
            <Download size={16} />
            SVG · A3
          </button>
          <button
            onClick={print}
            className="flex min-h-11 items-center gap-2 rounded-full bg-[#173655] px-4 text-sm font-bold text-white"
          >
            <Printer size={16} />
            {copy("Tulosta / PDF", "Print / PDF", "Skriv ut / PDF")}
          </button>
        </div>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f2f5f5] p-4">
        <div className="flex flex-wrap gap-2">
          {design.levels > 1 && (
            <div
              className="flex rounded-full border bg-white p-1"
              role="group"
              aria-label={copy("Valitse taso", "Choose level", "Välj våning")}
            >
              {Array.from(
                { length: design.levels },
                (_, index) => index + 1,
              ).map((item) => (
                <button
                  key={item}
                  aria-pressed={level === item}
                  onClick={() => {
                    setLevel(item);
                    setActive(
                      design.rooms.find((room) => (room.level ?? 1) === item)
                        ?.id ?? "oh",
                    );
                  }}
                  className={`min-h-9 rounded-full px-3 text-xs font-bold ${level === item ? "bg-[#173655] text-white" : ""}`}
                >
                  {copy("Taso", "Level", "Plan")} {item}
                </button>
              ))}
            </div>
          )}
          {(["plan", "section"] as const).map((v) => (
            <button
              key={v}
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`min-h-11 rounded-full px-4 text-sm font-bold ${view === v ? "bg-white shadow-sm" : ""}`}
            >
              {v === "plan"
                ? copy("Pohjapiirustus", "Floor plan", "Planritning")
                : copy("Leikkaus A–A", "Section A–A", "Sektion A–A")}
            </button>
          ))}
          <button
            aria-pressed={furnished}
            onClick={() => setFurnished(!furnished)}
            className="min-h-11 rounded-full border px-4 text-sm"
          >
            {furnished
              ? copy("Kalustettu", "Furnished", "Möblerad")
              : copy("Kiintokalusteet", "Fixed fittings", "Fast inredning")}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label={copy("Loitonna", "Zoom out", "Zooma ut")}
            onClick={() => setZoom(Math.max(1, zoom - 0.5))}
            className="grid h-11 w-11 place-items-center rounded-full bg-white"
          >
            <Minus size={16} />
          </button>
          <span className="text-sm">{zoom * 100}%</span>
          <button
            aria-label={copy("Lähennä", "Zoom in", "Zooma in")}
            onClick={() => setZoom(Math.min(3, zoom + 0.5))}
            className="grid h-11 w-11 place-items-center rounded-full bg-white"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div
        className="max-h-[850px] overflow-auto bg-[#e5e9e8] p-3 sm:p-6"
        tabIndex={0}
        aria-label={copy("Piirustus", "Drawing", "Ritning")}
      >
        <div
          style={{ width: `${zoom * 100}%`, minWidth: 550 }}
          className="mx-auto bg-white shadow-lg"
        >
          <svg
            ref={svg}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 21000 14850"
            width="420mm"
            height="297mm"
            className="h-auto w-full"
            role="img"
            aria-label={`${design.id} ${view} CONCEPT`}
          >
            <rect width="21000" height="14850" fill="white" />
            <rect
              x="450"
              y="450"
              width="20100"
              height="13950"
              fill="none"
              stroke="#a5afb0"
              strokeWidth="15"
            />
            <text
              x="15700"
              y="1050"
              fontSize="430"
              fontFamily="sans-serif"
              fontWeight="600"
              fill="#173655"
            >
              TUUMA NEXT / {design.id}
            </text>
            <text x="15700" y="1450" fontSize="145" fill="#73818a">
              {view === "plan" ? "POHJAPIIRUSTUS" : "LEIKKAUS A–A"} ·
              ASUNTOKONSEPTI · 2026-09-05
            </text>
            {view === "plan" ? (
              <g transform="translate(1700 3400)">
                <PlanGeometry
                  design={design}
                  active={room.id}
                  select={setActive}
                  furnished={furnished}
                  level={level}
                />
                <Dimension x1={0} y1={-2300} x2={design.width} y2={-2300} />
                <Dimension x1={-650} y1={0} x2={-650} y2={design.depth} />
                {visibleRooms
                  .filter((r) => r.z === 0)
                  .map((r) => (
                    <Dimension
                      key={r.id}
                      x1={r.x}
                      y1={-450}
                      x2={r.x + r.w}
                      y2={-450}
                    />
                  ))}
                <path
                  d={`M-850 ${design.depth * 0.48}H${design.width + 700}`}
                  stroke="#768c98"
                  strokeWidth="12"
                  strokeDasharray="130 60 25 60"
                />
                <text
                  x="-1000"
                  y={design.depth * 0.48}
                  fontSize="240"
                  fill="#526979"
                >
                  A
                </text>
                <text
                  x={design.width + 850}
                  y={design.depth * 0.48}
                  fontSize="240"
                  fill="#526979"
                >
                  A
                </text>
              </g>
            ) : <SectionDrawing design={design} />}
            <g
              transform="translate(15700 2500)"
              fontFamily="sans-serif"
              fill="#243f51"
            >
              <text fontSize="300" fontWeight="600">
                {design.name}
              </text>
              <text y="400" fontSize="220">
                HUONELUETTELO / TILAMALLI{" "}
                {design.levels > 1 ? `· TASO ${level}` : ""}
              </text>
              {visibleRooms.map((r, i) => (
                <g key={r.id} transform={`translate(0 ${900 + i * 390})`}>
                  <text fontSize="220">{r.code}</text>
                  <text x="3400" fontSize="220" textAnchor="end">
                    {roomArea(r).toFixed(1)} m²*
                  </text>
                  <path d="M0 150H3400" stroke="#d6dddd" strokeWidth="12" />
                </g>
              ))}
              {[
                "MITAT MILLIMETREINÄ",
                "Ulko-/väliseinä 300 / 120 mm",
                "Vapaa huonekorkeus 2 600 mm",
                "JK/PA · jääkaappi / pakastin",
                "PK · pesukone / SK · säilytys",
                "KI · kiuas / S · sauna",
                "* Suuntaa-antava tilapinta-ala.",
                "Akselimitta − 150 mm / sivumitta.",
                "Ei virallista huoneistoalamittausta.",
                "LUONNOS · EI RAKENTAMISEEN",
                "Ei viranomais- tai toteutussuunnitelma.",
              ].map((line, i) => (
                <text key={line} y={4900 + i * 340} fontSize="185">
                  {line}
                </text>
              ))}
            </g>
            <g transform="translate(1100 13800)" fill="#243e4c">
              <path
                d="M0 0H5000 M0 -80V80 M1000 -80V80 M2500 -80V80 M5000 -80V80"
                stroke="currentColor"
                strokeWidth="20"
              />
              <text x="0" y="330" fontSize="180">
                0
              </text>
              <text x="2450" y="330" fontSize="180">
                2,5
              </text>
              <text x="4800" y="330" fontSize="180">
                5 m
              </text>
            </g>
            <rect
              x="12000"
              y="13200"
              width="8550"
              height="1200"
              stroke="#859699"
              fill="white"
              strokeWidth="15"
            />
            <text x="12300" y="13640" fontSize="260" fill="#173655">
              TUUMA NEXT · {design.id} · ARK {view === "plan" ? "101" : "201"}
            </text>
            <text x="12300" y="14140" fontSize="210" fill="#637680">
              1:50 @ A3 / 100% · REV B · CONCEPT / DEMO
            </text>
          </svg>
        </div>
      </div>
      <footer className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
        <div>
          <p className="font-semibold">
            {room.code} · {text(roomNames[room.kind])}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {room.w} × {room.d} mm ·{" "}
            {copy("akselimitat", "wall centre-line dimensions", "axelmått")}
          </p>
        </div>
        <p className="text-sm leading-6 text-slate-500">
          {copy(
            "Luonnos. Sama geometria 3D-mallissa ja kierroksessa. Pätevä suunnittelija tarkistaa pinta-alat, esteettömyyden ja lupavaatimukset.",
            "Concept. The same geometry drives the 3D model and tour. A qualified designer must verify areas, accessibility and permit requirements.",
            "Koncept. Samma geometri i 3D-modellen och rundturen. En behörig planerare måste kontrollera areor, tillgänglighet och lovkrav.",
          )}
        </p>
      </footer>
    </section>
  );
}
