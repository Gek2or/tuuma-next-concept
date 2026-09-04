"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Compass, Ruler, Sofa } from "lucide-react";
import { useLanguage, type LocalizedText } from "./LanguageProvider";

type PlanRoom = {
  id: string;
  label: string;
  area: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  note?: string;
};

type Plan = {
  id: string;
  title: string;
  meta: string;
  rooms: PlanRoom[];
};

const plans: Plan[] = [
  {
    id: "A12",
    title: "2H + KT",
    meta: "56,5 m² · 3. kerros",
    rooms: [
      { id: "living", label: "Olohuone", area: "22,6 m²", x: 26, y: 32, width: 218, height: 132, fill: "#d9eafa", note: "Länsi" },
      { id: "kitchen", label: "Keittiö", area: "9,1 m²", x: 26, y: 164, width: 112, height: 112, fill: "#f6e6be", note: "Avokeittiö" },
      { id: "hall", label: "Eteinen", area: "6,4 m²", x: 138, y: 164, width: 106, height: 112, fill: "#f3f0e9" },
      { id: "bedroom", label: "Makuuhuone", area: "13,8 m²", x: 244, y: 32, width: 198, height: 128, fill: "#dcefe7", note: "140 cm sänky" },
      { id: "bathroom", label: "Kylpyhuone", area: "4,6 m²", x: 244, y: 160, width: 112, height: 116, fill: "#e8e1f4", note: "Pesutorni" },
      { id: "sauna", label: "Parveke", area: "Lasitettu", x: 356, y: 160, width: 86, height: 116, fill: "#e7edf1", note: "Länsi" },
    ],
  },
  {
    id: "A14",
    title: "3H + KT",
    meta: "68 m² · 3. kerros",
    rooms: [
      { id: "living", label: "Olohuone", area: "24,1 m²", x: 26, y: 32, width: 218, height: 130, fill: "#d9eafa", note: "Länsi" },
      { id: "kitchen", label: "Keittiö", area: "10,2 m²", x: 26, y: 162, width: 108, height: 114, fill: "#f6e6be", note: "Avokeittiö" },
      { id: "bedroom", label: "Makuuhuone", area: "14,8 m²", x: 244, y: 32, width: 198, height: 104, fill: "#dcefe7", note: "140 cm sänky" },
      { id: "room2", label: "Työhuone", area: "9,6 m²", x: 244, y: 136, width: 104, height: 140, fill: "#f0e6d8", note: "120 cm sänky" },
      { id: "bathroom", label: "Kylpyhuone", area: "5,1 m²", x: 348, y: 136, width: 94, height: 84, fill: "#e8e1f4", note: "Pesutorni" },
      { id: "hall", label: "Eteinen", area: "4,2 m²", x: 348, y: 220, width: 94, height: 56, fill: "#f3f0e9" },
    ],
  },
];

const roomCopy: Record<string, LocalizedText> = {
  living: { fi: "Olohuone", en: "Living room", sv: "Vardagsrum" },
  kitchen: { fi: "Keittiö", en: "Kitchen", sv: "Kök" },
  hall: { fi: "Eteinen", en: "Hallway", sv: "Hall" },
  bedroom: { fi: "Makuuhuone", en: "Bedroom", sv: "Sovrum" },
  room2: { fi: "Työhuone", en: "Study", sv: "Arbetsrum" },
  bathroom: { fi: "Kylpyhuone", en: "Bathroom", sv: "Badrum" },
  sauna: { fi: "Parveke", en: "Balcony", sv: "Balkong" },
};

const planCopy: Record<string, LocalizedText> = {
  eyebrow: { fi: "Pohjapiirros · mitoitettu konsepti", en: "Floor plan · measured concept", sv: "Planritning · måttsatt koncept" },
  title: { fi: "Koti näkyy ennen hakemusta", en: "See the home before applying", sv: "Se bostaden innan du ansöker" },
  intro: { fi: "Valitse huone nähdäksesi koon, käyttötavan ja 360‑hotspotin.", en: "Select a room to see its size, use and 360° hotspot.", sv: "Välj ett rum för storlek, användning och 360°-hotspot." },
  selected: { fi: "Valittu tila", en: "Selected room", sv: "Valt rum" },
  area: { fi: "pinta-ala", en: "floor area", sv: "yta" },
  tip: { fi: "käyttövinkki", en: "use tip", sv: "användningstips" },
  paragraph: { fi: "Plan data on eroteltu huoneiksi, jotta sama tieto voidaan näyttää asuntohaussa, 360‑kierroksella ja myöhemmin Tampuuri‑rajapinnan kautta.", en: "Plan data is structured by room so the same information can power search, the 360° tour and a future Tampuuri integration.", sv: "Plandata är strukturerad per rum så att samma information kan användas i sökningen, 360°-rundturen och en framtida Tampuuri-integration." },
  hotspot: { fi: "Hotspotit yhdistävät huoneen virtuaalikierrokseen.", en: "Hotspots connect each room to the virtual tour.", sv: "Hotspots kopplar varje rum till rundturen." },
  west: { fi: "Parveke / länsi", en: "Balcony / west", sv: "Balkong / väster" },
};

export function ApartmentPlan({ initialApartment = "A12" }: { initialApartment?: string }) {
  const { text } = useLanguage();
  const [selectedPlanId, setSelectedPlanId] = useState(initialApartment === "A14" ? "A14" : "A12");
  const [activeRoom, setActiveRoom] = useState("living");
  const plan = useMemo(() => plans.find((item) => item.id === selectedPlanId) ?? plans[0], [selectedPlanId]);
  const selected = plan.rooms.find((room) => room.id === activeRoom) ?? plan.rooms[0];
  const roomLabel = (room: PlanRoom) => text(roomCopy[room.id] ?? { fi: room.label, en: room.label, sv: room.label });

  function selectRoom(room: PlanRoom) {
    setActiveRoom(room.id);
  }

  return (
    <section className="rounded-[28px] border border-[#d8e2e8] bg-[#fffdf8] p-5 shadow-[0_18px_50px_rgba(33,56,74,.06)] sm:p-7" aria-labelledby="plan-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{text(planCopy.eyebrow)}</p>
          <h3 id="plan-title" className="display mt-2 text-3xl text-[#123451] sm:text-4xl">{text(planCopy.title)}</h3>
          <p className="mt-2 text-sm text-[#64798d]">{text(planCopy.intro)}</p>
        </div>
        <div className="flex gap-2 rounded-2xl bg-[#eef3f5] p-1" role="tablist" aria-label="Valitse asunto">
          {plans.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={selectedPlanId === item.id}
              onClick={() => { setSelectedPlanId(item.id); setActiveRoom("living"); }}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${selectedPlanId === item.id ? "bg-white text-[#0b58a8] shadow-sm" : "text-[#60758a] hover:text-[#173655]"}`}
            >
              {item.id}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
        <div className="overflow-hidden rounded-[22px] border border-[#cfdbe3] bg-[#f5f2eb] p-2 sm:p-4">
          <svg viewBox="0 0 468 312" className="h-auto w-full" role="img" aria-label={`${text({ fi: "Asunnon", en: "Apartment", sv: "Bostad" })} ${plan.id} ${text({ fi: "pohjapiirros", en: "floor plan", sv: "planritning" })}`}>
            <rect x="16" y="22" width="436" height="266" rx="6" fill="#fffdf8" stroke="#173655" strokeWidth="3" />
            {plan.rooms.map((room) => {
              const selectedRoom = room.id === selected.id;
              return (
                <g
                  key={room.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${roomLabel(room)}, ${room.area}`}
                  aria-pressed={selectedRoom}
                  onClick={() => selectRoom(room)}
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectRoom(room); } }}
                  className="cursor-pointer outline-none"
                >
                  <rect x={room.x} y={room.y} width={room.width} height={room.height} fill={selectedRoom ? "#b9d8f2" : room.fill} stroke={selectedRoom ? "#0b58a8" : "#567087"} strokeWidth={selectedRoom ? 3 : 1.8} />
                  <text x={room.x + room.width / 2} y={room.y + room.height / 2 - 3} textAnchor="middle" fontSize="11" fontWeight="700" fill="#173655">{roomLabel(room)}</text>
                  <text x={room.x + room.width / 2} y={room.y + room.height / 2 + 13} textAnchor="middle" fontSize="9" fill="#587087">{room.area}</text>
                  {room.note && <text x={room.x + 8} y={room.y + 15} fontSize="7" fill="#6e8293">{room.note}</text>}
                  <path d={`M ${room.x + room.width / 2 - 12} ${room.y + room.height} L ${room.x + room.width / 2 + 12} ${room.y + room.height}`} stroke="#fffdf8" strokeWidth="4" />
                </g>
              );
            })}
            <path d="M 70 22 V 12 H 182 V 22" fill="none" stroke="#0b58a8" strokeWidth="2" />
            <text x="126" y="10" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0b58a8">{text(planCopy.west)}</text>
            <g transform="translate(410 44)">
              <circle cx="0" cy="0" r="13" fill="#fffdf8" stroke="#173655" strokeWidth="1.5" />
              <path d="M 0 -8 V 8 M -4 4 L 0 8 L 4 4" stroke="#173655" strokeWidth="1.5" fill="none" />
              <text x="0" y="-15" textAnchor="middle" fontSize="8" fontWeight="700" fill="#173655">N</text>
            </g>
            <g transform="translate(28 300)">
              <path d="M 0 0 H 56" stroke="#173655" strokeWidth="2" />
              <path d="M 0 -3 V 3 M 56 -3 V 3" stroke="#173655" strokeWidth="1.5" />
              <text x="28" y="12" textAnchor="middle" fontSize="8" fill="#587087">5 m</text>
            </g>
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e7f0f8] text-[#0b58a8]"><Sofa size={20} /></span>
            <div>
              <p className="text-sm font-bold text-[#698095]">{text(planCopy.selected)}</p>
              <h4 className="text-2xl font-black text-[#173655]">{roomLabel(selected)}</h4>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-2xl bg-[#f2f5f5] p-4"><Ruler size={16} className="text-[#0b58a8]" /><b className="mt-2 block">{selected.area}</b><span className="text-[#708398]">{text(planCopy.area)}</span></div>
            <div className="rounded-2xl bg-[#f2f5f5] p-4"><Compass size={16} className="text-[#0b58a8]" /><b className="mt-2 block">{selected.note ?? text({ fi: "Kulku", en: "Flow", sv: "Flöde" })}</b><span className="text-[#708398]">{text(planCopy.tip)}</span></div>
          </div>
          <p className="mt-5 text-sm leading-6 text-[#60758a]">{text(planCopy.paragraph)}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {plan.rooms.map((room) => (
              <button key={room.id} onClick={() => selectRoom(room)} className={`rounded-full border px-3 py-2 text-xs font-black transition ${room.id === selected.id ? "border-[#0b58a8] bg-[#e5f0fb] text-[#0b58a8]" : "border-[#d7e1e6] bg-white text-[#536c83] hover:border-[#8fb4d8]"}`}>
                {roomLabel(room)}
              </button>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#708398]"><ArrowUpRight size={14} /> {text(planCopy.hotspot)}</p>
        </div>
      </div>
    </section>
  );
}
