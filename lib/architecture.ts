/** Concept design, millimetres, wall centre lines. Not permit/construction documents. */
export type RoomKind = "living" | "kitchen" | "bedroom" | "hall" | "bathroom" | "sauna" | "storage";
export type DesignRoom = {
    id: string;
    kind: RoomKind;
    code: string;
    x: number;
    z: number;
    w: number;
    d: number;
    /** Storeys are deliberately explicit for the original duplex concept models. */
    level?: number;
};
export type Wall = {
    id: string;
    axis: "x" | "z";
    at: number;
    start: number;
    end: number;
    rooms: string[];
    thickness: number;
    level?: number;
    opening?: {
        start: number;
        width: number;
        kind: "door" | "window" | "glazedDoor" | "open";
        sill: number;
        height: number;
    };
};
export type Fitting = {
    id: string;
    room: string;
    kind: "bed" | "sofa" | "table" | "chair" | "kitchen" | "fridge" | "sink" | "hob" | "wardrobe" | "shower" | "wc" | "basin" | "washer" | "bench" | "heater" | "rug" | "stairs";
    x: number;
    z: number;
    w: number;
    d: number;
    angle?: number;
    fixed: boolean;
    level?: number;
};
export type Design = {
    id: string;
    width: number;
    depth: number;
    height: number;
    rooms: DesignRoom[];
    walls: Wall[];
    fittings: Fitting[];
    outdoor: {
        x: number;
        z: number;
        w: number;
        d: number;
        terrace: boolean;
    };
    name: string;
    levels: number;
};
const r = (id: string, kind: RoomKind, code: string, x: number, z: number, w: number, d: number, level = 1): DesignRoom => ({ id, kind, code, x, z, w, d, level });
const layouts: Record<string, {
    name: string;
    width: number;
    depth: number;
    rooms: DesignRoom[];
    terrace?: boolean;
    levels?: number;
}> = {
    A12: { name: "2H + KT", width: 8000, depth: 7500, rooms: [r("oh", "living", "OH", 0, 0, 4500, 4300), r("kt", "kitchen", "KT", 0, 4300, 2700, 3200), r("et", "hall", "ET", 2700, 4300, 5300, 1400), r("mh1", "bedroom", "MH", 4500, 0, 3500, 4300), r("kph", "bathroom", "KPH", 4500, 5700, 3500, 1800), r("vh", "storage", "VH", 2700, 5700, 1800, 1800)] },
    A14: { name: "3H + KT", width: 10000, depth: 7300, rooms: [r("oh", "living", "OH", 0, 0, 6500, 4000), r("kph", "bathroom", "KPH", 0, 4000, 2600, 3300), r("et", "hall", "ET", 2600, 4000, 1600, 3300), r("kt", "kitchen", "KT", 4200, 4000, 2300, 3300), r("mh1", "bedroom", "MH1", 6500, 0, 3500, 3650), r("mh2", "bedroom", "MH2", 6500, 3650, 3500, 3650)] },
    B24: { name: "3H + KT + S", width: 9000, depth: 8200, rooms: [r("mh1", "bedroom", "MH1", 0, 0, 3400, 3500), r("mh2", "bedroom", "MH2", 3400, 0, 3100, 3500), r("kph", "bathroom", "KPH", 6500, 0, 2500, 2300), r("s", "sauna", "S", 6500, 2300, 2500, 1200), r("et", "hall", "ET", 0, 3500, 9000, 1400), r("oh", "living", "OH", 0, 4900, 5500, 3300), r("kt", "kitchen", "KT", 5500, 4900, 3500, 3300)] },
    C07: { name: "2H + KT", width: 6200, depth: 7900, terrace: true, rooms: [r("oh", "living", "OH", 0, 0, 3500, 4600), r("mh1", "bedroom", "MH", 3500, 0, 2700, 4600), r("kt", "kitchen", "KT", 0, 4600, 3500, 3300), r("kph", "bathroom", "KPH", 3500, 4600, 2700, 1900), r("et", "hall", "ET", 3500, 6500, 2700, 1400)] },
    A31: { name: "4H + KT + S", width: 11800, depth: 7400, rooms: [r("mh1", "bedroom", "MH1", 0, 0, 3700, 3200), r("mh2", "bedroom", "MH2", 3700, 0, 3300, 3200), r("mh3", "bedroom", "MH3", 7000, 0, 2800, 3200), r("s", "sauna", "S", 9800, 0, 2000, 1400), r("kph", "bathroom", "KPH", 9800, 1400, 2000, 3000), r("et", "hall", "ET", 0, 3200, 9800, 1200), r("oh", "living", "OH", 0, 4400, 7000, 3000), r("kt", "kitchen", "KT", 7000, 4400, 4800, 3000)] },
    D18: { name: "1H + KT", width: 5500, depth: 7100, rooms: [r("oh", "living", "OH / ALK", 0, 0, 5500, 4100), r("kt", "kitchen", "KT", 0, 4100, 2500, 3000), r("et", "hall", "ET", 2500, 4100, 3000, 1200), r("kph", "bathroom", "KPH", 2500, 5300, 3000, 1800)] },
    E05: { name: "3H + KT + S", width: 7800, depth: 9900, terrace: true, rooms: [r("oh", "living", "OH", 0, 0, 7800, 3300), r("mh1", "bedroom", "MH1", 0, 3300, 3200, 3500), r("et", "hall", "ET", 3200, 3300, 1400, 6600), r("kt", "kitchen", "KT", 4600, 3300, 3200, 3500), r("mh2", "bedroom", "MH2", 0, 6800, 3200, 3100), r("kph", "bathroom", "KPH", 4600, 6800, 3200, 1900), r("s", "sauna", "S", 4600, 8700, 2000, 1200), r("vh", "storage", "VH", 6600, 8700, 1200, 1200)] },
    // Original digital-twin concept layouts. Public unit type and size informed these models;
    // they are not copies of permit or construction drawings.
    // Showcase layouts use the published unit types and areas as constraints.
    // They remain concept drawings, but every level is a complete, walkable rectangle.
    C09: { name: "2H + KK · konseptipohja", width: 5000, depth: 11300, terrace: true, rooms: [r("oh", "living", "OH", 0, 0, 3300, 3600), r("kt", "kitchen", "KK", 3300, 0, 1700, 3600), r("mh1", "bedroom", "MH", 0, 3600, 3300, 5000), r("kph", "bathroom", "PH", 3300, 3600, 1700, 1800), r("vh", "storage", "VH", 3300, 5400, 1700, 2800), r("tk", "storage", "TK", 3300, 8200, 1700, 3100), r("et", "hall", "ET", 0, 8600, 3300, 2700)] },
    E15: { name: "3H + K · 2 tasoa · konseptipohja", width: 4700, depth: 8191, terrace: true, levels: 2, rooms: [r("porras1", "hall", "PORRAS", 0, 0, 1100, 3200, 1), r("oh", "living", "OH", 1100, 0, 3600, 3200, 1), r("wc", "bathroom", "WC", 0, 3200, 1300, 1200, 1), r("et", "hall", "ET", 0, 4400, 1300, 3791, 1), r("kt", "kitchen", "K", 1300, 3200, 3400, 4991, 1), r("porras2", "hall", "PORRAS", 0, 0, 1100, 3200, 2), r("ph", "bathroom", "PH", 1100, 0, 3600, 2200, 2), r("hall2", "hall", "AULA", 1100, 2200, 3600, 1000, 2), r("mh2", "bedroom", "MH2", 0, 3200, 2400, 4991, 2), r("mh1", "bedroom", "MH1", 2400, 3200, 2300, 4991, 2)] },
    F20: { name: "4H + K · 2 tasoa · konseptipohja", width: 6200, depth: 7419, terrace: true, levels: 2, rooms: [r("oh", "living", "OH", 0, 0, 4200, 3400, 1), r("porras1", "hall", "PORRAS", 4200, 0, 2000, 3000, 1), r("wc", "bathroom", "WC", 4200, 3000, 2000, 1000, 1), r("kt", "kitchen", "K", 0, 3400, 3200, 4019, 1), r("et", "hall", "ET", 3200, 3400, 1000, 4019, 1), r("kph", "bathroom", "PH", 4200, 4000, 2000, 3419, 1), r("mh3", "bedroom", "MH3", 0, 0, 3000, 2700, 2), r("ph2", "bathroom", "PH", 3000, 0, 1200, 3000, 2), r("porras2", "hall", "PORRAS", 4200, 0, 2000, 3000, 2), r("hall2", "hall", "AULA", 0, 2700, 3000, 900, 2), r("hall3", "hall", "AULA", 3000, 3000, 3200, 600, 2), r("mh1", "bedroom", "MH1", 0, 3600, 3200, 3819, 2), r("mh2", "bedroom", "MH2", 3200, 3600, 3000, 3819, 2)] },
};
function createWallsForFloor(rooms: DesignRoom[]): Wall[] {
    const lines = new Map<string, {
        axis: "x" | "z";
        at: number;
        intervals: {
            start: number;
            end: number;
            room: string;
        }[];
    }>();
    for (const room of rooms)
        for (const [axis, at, start, end] of [["x", room.z, room.x, room.x + room.w], ["x", room.z + room.d, room.x, room.x + room.w], ["z", room.x, room.z, room.z + room.d], ["z", room.x + room.w, room.z, room.z + room.d]] as const) {
            const key = `${axis}:${at}`;
            if (!lines.has(key))
                lines.set(key, { axis, at, intervals: [] });
            lines.get(key)!.intervals.push({ start, end, room: room.id });
        }
    const walls: Wall[] = [];
    for (const line of lines.values()) {
        const stops = [...new Set(line.intervals.flatMap(i => [i.start, i.end]))].sort((a, b) => a - b);
        for (let i = 0; i < stops.length - 1; i++) {
            const start = stops[i], end = stops[i + 1];
            const members = line.intervals.filter(v => v.start <= start && v.end >= end).map(v => v.room);
            if (members.length)
                walls.push({ id: `${line.axis}:${line.at}:${start}`, axis: line.axis, at: line.at, start, end, rooms: members, thickness: members.length === 1 ? 300 : 120 });
        }
    }
    // A connected room graph. Prefer circulation areas; sauna access is via bathroom.
    const parent = new Map(rooms.map(room => [room.id, room.id]));
    const root = (id: string): string => parent.get(id) === id ? id : root(parent.get(id)!);
    const candidates = walls.filter(w => w.rooms.length === 2 && w.end - w.start >= 1120).sort((a, b) => {
        const score = (w: Wall) => {
            const pair = w.rooms.map(id => rooms.find(room => room.id === id)!);
            if (pair.some(room => room.kind === "sauna")) return pair.some(room => room.kind === "bathroom") ? 150 : -150;
            if (pair.every(room => room.kind === "hall")) return 140;
            if (pair.some(room => room.kind === "hall")) return 120;
            if (pair.some(room => room.kind === "living") && pair.some(room => room.kind === "kitchen")) return 110;
            if (pair.some(room => room.kind === "bedroom")) return -10;
            return 20;
        };
        return score(b) - score(a) || (b.end - b.start) - (a.end - a.start);
    });
    for (const wall of candidates) {
        const [a, b] = wall.rooms;
        if (root(a) === root(b))
            continue;
        if (wall.rooms.includes("s") && !wall.rooms.includes("kph"))
            continue;
        parent.set(root(a), root(b));
        const open = (wall.rooms.includes("oh") && wall.rooms.includes("kt")) || (wall.rooms.includes("et") && wall.rooms.some(id => id === "oh" || id === "kt"));
        const width = open ? Math.min(2100, wall.end - wall.start - 360) : wall.rooms.includes("s") ? 800 : 1000;
        wall.opening = { start: (wall.start + wall.end - width) / 2, width, kind: open ? "open" : "door", sill: 0, height: 2100 };
    }
    // Full-height external entrance and generously glazed living/bedroom facades.
    const entry = walls.filter(w => w.rooms.length === 1 && w.rooms[0] === "et" && w.end - w.start >= 900).sort((a, b) => (b.end - b.start) - (a.end - a.start))[0];
    if (entry) {
        const width = Math.min(1100, entry.end - entry.start - 100);
        entry.opening = { start: (entry.start + entry.end - width) / 2, width, kind: "door", sill: 0, height: 2200 };
    }
    for (const room of rooms.filter(v => ["living", "bedroom", "kitchen"].includes(v.kind))) {
        const exterior = walls.filter(w => w.rooms.length === 1 && w.rooms[0] === room.id && !w.opening && w.end - w.start >= 1600).sort((a, b) => (b.end - b.start) - (a.end - a.start))[0];
        if (exterior) {
            const width = Math.min(room.kind === "living" ? 3000 : 2000, exterior.end - exterior.start - 650);
            exterior.opening = { start: (exterior.start + exterior.end - width) / 2, width, kind: "window", sill: 700, height: 1600 };
        }
    }
    return walls;
}
function createWalls(rooms: DesignRoom[]): Wall[] {
    const levels = [...new Set(rooms.map(room => room.level ?? 1))].sort((a, b) => a - b);
    return levels.flatMap(level => createWallsForFloor(rooms.filter(room => (room.level ?? 1) === level)).map(wall => ({ ...wall, id: `${wall.id}:L${level}`, level })));
}
function createFittings(rooms: DesignRoom[]): Fitting[] {
    const items: Fitting[] = [];
    for (const room of rooms) {
        const add = (kind: Fitting["kind"], x: number, z: number, w: number, d: number, fixed = false) => items.push({ id: `${room.id}-${kind}-${items.length}`, room: room.id, kind, x: room.x + x, z: room.z + z, w, d, fixed, level: room.level ?? 1 });
        if (room.kind === "bedroom") {
            add("bed", 250, 250, room.w > 3000 ? 1600 : 1200, 2100);
            add("wardrobe", room.w - 750, 200, 600, 1200, true);
        }
        if (room.kind === "living") {
            add("rug", room.w * .26, room.d * .30, 2000, 1800);
            add("sofa", 300, 300, Math.min(2400, room.w - 800), 900);
            add("table", 900, 1600, 950, 550);
            if (room.code.includes("ALK"))
                add("bed", room.w - 1700, 250, 1400, 2100);
        }
        if (room.kind === "kitchen") {
            add("kitchen", 180, 180, Math.min(2400, room.w - 900), 620, true);
            add("fridge", room.w - 780, 180, 600, 620, true);
            add("sink", 280, 210, 500, 500, true);
            add("hob", 980, 230, 500, 480, true);
            if (room.w >= 2500 && room.d > 2500) {
                const tableZ = Math.max(950, Math.min(1500, room.d - 1200));
                add("table", 500, tableZ, 1300, 750);
                add("chair", 600, Math.max(180, tableZ - 350), 420, 400);
                add("chair", 600, Math.min(room.d - 400, tableZ + 830), 420, 400);
            }
        }
        if (room.kind === "bathroom" && room.code === "WC") {
            add("wc", Math.max(180, room.w - 620), 180, 420, 680, true);
            add("basin", 180, room.d - 650, Math.min(600, room.w - 360), 480, true);
        }
        if (room.kind === "bathroom" && room.code !== "WC") {
            add("shower", 180, 180, 900, 900, true);
            add("wc", room.w - 760, 180, 420, 680, true);
            add("basin", room.w - 780, room.d - 650, 600, 480, true);
            if (room.w > 2400)
                add("washer", room.d < 2300 ? room.w - 1450 : 180, room.d < 2300 ? 180 : room.d - 780, 600, 600, true);
        }
        if (room.kind === "sauna") {
            add("bench", 180, 150, room.w - 360, 580, true);
            add("heater", room.w - 650, room.d - 560, 450, 400, true);
        }
        if (room.kind === "storage" && room.w > 1000)
            add("wardrobe", 180, 180, 600, Math.max(600, room.d - 360), true);
        if (room.code === "PORRAS")
            add("stairs", 170, 160, room.w - 340, room.d - 320, true);
    }
    return items;
}
export const designs: Record<string, Design> = Object.fromEntries(Object.entries(layouts).map(([id, layout]) => {
    const walls = createWalls(layout.rooms);
    const living = layout.rooms.find(room => room.kind === "living")!;
    const bottom = living.z > layout.depth / 2;
    const outdoorWidth = Math.min(living.w - 600, 4200);
    const outdoor = { x: living.x + (living.w - outdoorWidth) / 2, z: bottom ? layout.depth + 150 : -1950, w: outdoorWidth, d: 1800, terrace: !!layout.terrace };
    const facade = walls.find(w => w.level === (living.level ?? 1) && w.axis === "x" && w.at === (bottom ? layout.depth : 0) && w.rooms.includes(living.id));
    if (facade) {
        const width = Math.min(2800, outdoor.w - 400);
        // The terrace-side opening is a full-height glazed door, rather than a
        // generic window: it is the physical connection between the living room
        // and the outdoor deck in both the plan and the dollhouse.
        facade.opening = { start: (facade.start + facade.end - width) / 2, width, kind: "glazedDoor", sill: 0, height: 2200 };
    }
    return [id, { id, ...layout, height: 2600, levels: layout.levels ?? 1, walls, fittings: createFittings(layout.rooms), outdoor }];
}));
export const designFor = (id: string) => designs[id] ?? designs.A12;
/** One shared U-stair definition for plan, model, camera and floor void. Metres. */
export function stairProfile(design: Design) {
    const room = design.rooms.find(r => r.code === "PORRAS" && r.level === 1);
    if (!room) return null;
    const axis = room.w >= room.d ? "x" : "z";
    const width = (axis === "x" ? room.w : room.d) / 1000;
    const depth = (axis === "x" ? room.d : room.w) / 1000;
    const steps = 8, start = .45, landing = .55;
    const run = width - start - landing;
    return { room, axis, width, depth, steps, start, landing, run, tread: run / steps,
        rise: (design.height / 1000 + .22) / (steps * 2),
        flightWidth: (depth - .18) / 2, nearLane: depth / 4, farLane: depth * .75 };
}
export const roomArea = (room: DesignRoom) => ((room.w - 150) * (room.d - 150) / 1e6);
export const roomNames: Record<RoomKind, {
    fi: string;
    en: string;
    sv: string;
}> = { living: { fi: "Olohuone", en: "Living room", sv: "Vardagsrum" }, kitchen: { fi: "Keittiö", en: "Kitchen", sv: "Kök" }, bedroom: { fi: "Makuuhuone", en: "Bedroom", sv: "Sovrum" }, hall: { fi: "Eteinen", en: "Hallway", sv: "Hall" }, bathroom: { fi: "Kylpyhuone", en: "Bathroom", sv: "Badrum" }, sauna: { fi: "Sauna", en: "Sauna", sv: "Bastu" }, storage: { fi: "Vaatehuone", en: "Storage", sv: "Klädkammare" } };
