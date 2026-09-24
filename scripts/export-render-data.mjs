import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { apartments } from "../lib/data.ts";
import { cameraSpot, designs, roomNames, stairProfile } from "../lib/architecture.ts";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteDirectory = resolve(scriptDirectory, "..");
const target = resolve(siteDirectory, "..", "source", "tuuma-render-export", "apartments.json");
const previous = JSON.parse(readFileSync(target, "utf8"));
const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: siteDirectory, encoding: "utf8" }).trim();
const showcaseIds = ["C09", "E15", "F20"];

function nodeFor(design, room) {
  const positionM = cameraSpot(design, room.id);
  const floor = (room.level - 1) * (design.height / 1000 + .22);
  return {
    id: room.id,
    level: room.level,
    code: room.code,
    kind: room.kind,
    labels: roomNames[room.kind],
    positionM,
    lookAtM: [
      (room.x + room.w * .55) / 1000,
      floor + 1.4,
      (room.z + Math.min(350, room.d * .35)) / 1000,
    ],
  };
}

function hotspotPosition(wall) {
  const opening = wall.opening;
  const along = (opening.start + opening.width / 2) / 1000;
  const y = (wall.level - 1) * 2.82 + 1.2;
  return wall.axis === "x" ? [along, y, wall.at / 1000] : [wall.at / 1000, y, along];
}

function tourFor(design) {
  const nodes = design.rooms.map(room => nodeFor(design, room));
  const links = design.walls
    .filter(wall => wall.rooms.length === 2 && wall.opening && wall.opening.kind !== "window")
    .map(wall => ({
      kind: "door-or-open",
      from: wall.rooms[0],
      to: wall.rooms[1],
      bidirectional: true,
      wallId: wall.id,
      hotspotPositionM: hotspotPosition(wall),
    }));
  const stairs = design.rooms.filter(room => room.code === "PORRAS").sort((a, b) => a.level - b.level);
  const profile = stairProfile(design);
  if (stairs.length === 2 && profile) {
    const along = profile.start + profile.run + profile.landing / 2;
    const cross = profile.depth / 2;
    const plan = profile.axis === "x"
      ? [profile.room.x / 1000 + along, profile.room.z / 1000 + cross]
      : [profile.room.x / 1000 + cross, profile.room.z / 1000 + along];
    links.push({ kind: "stairs", from: stairs[0].id, to: stairs[1].id, bidirectional: false, hotspotPositionM: [plan[0], 1.4, plan[1]] });
    links.push({ kind: "stairs", from: stairs[1].id, to: stairs[0].id, bidirectional: false, hotspotPositionM: [plan[0], 4.22, plan[1]] });
  }
  const externalOpenings = design.walls.filter(wall => wall.rooms.length === 1 && wall.opening);
  const ids = new Set(nodes.map(node => node.id));
  const reached = new Set(["oh"]);
  for (let pass = 0; pass < nodes.length; pass++) for (const link of links) {
    if (reached.has(link.from)) reached.add(link.to);
    if (link.bidirectional && reached.has(link.to)) reached.add(link.from);
  }
  assert.deepEqual(reached, ids, `${design.id}: tour graph is disconnected`);
  return {
    currentMode: "Baked equirectangular 360 tour from the shared concept geometry",
    hasLegacyIllustratedPanorama: false,
    nodes,
    links,
    externalOpenings,
    proposedTerraceNode: { implemented: false, positionM: [design.outdoor.x / 1000 + design.outdoor.w / 2000, 1.6, design.outdoor.z / 1000 + design.outdoor.d / 2000] },
    notes: "Every modeled room is a panorama point. Door and stair hotspots use the same geometry as the plan and 3D model.",
  };
}

const exportedApartments = showcaseIds.map(id => {
  const listing = apartments.find(apartment => apartment.id === id);
  const design = designs[id];
  assert.ok(listing && design, `Missing showcase ${id}`);
  const profile = stairProfile(design);
  return { id, listing, design, stairProfileM: profile, tour: tourFor(design) };
});

const output = {
  ...previous,
  source: { publishedVersion: 30, commit },
  status: "Validated CONCEPT geometry for the C09, E15 and F20 demo; not official construction drawings or verified as-built dimensions.",
  apartments: exportedApartments,
};
writeFileSync(target, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ target, commit, apartments: exportedApartments.map(apartment => ({ id: apartment.id, rooms: apartment.design.rooms.length, points: apartment.tour.nodes.length, links: apartment.tour.links.length })) }, null, 2));
