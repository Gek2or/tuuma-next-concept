import assert from 'node:assert/strict';
import test from 'node:test';
import { cameraSpot, designs, roomArea, stairProfile } from '../lib/architecture.ts';

test('all concept apartments have unique, fully partitioned layouts on every level', () => {
  assert.equal(Object.keys(designs).length, 10);
  assert.equal(new Set(Object.values(designs).map(d=>JSON.stringify(d.rooms))).size, 10);
  for (const d of Object.values(designs)) {
    assert.equal(new Set(d.rooms.map(r=>r.level ?? 1)).size,d.levels,d.id);
    for(let level=1;level<=d.levels;level++) {
      const rooms=d.rooms.filter(r=>(r.level ?? 1)===level);
      assert.equal(rooms.reduce((sum,r)=>sum+r.w*r.d,0),d.width*d.depth,`${d.id}/L${level}`);
      for (const a of rooms) for (const b of rooms) if(a.id!==b.id) {
        assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.z+a.d<=b.z||b.z+b.d<=a.z,`${d.id}/L${level}: overlapping rooms ${a.id}/${b.id}`);
      }
    }
  }
});
test('every apartment has an entrance and a connected room graph on each level', () => {
  for (const d of Object.values(designs)) {
    assert.equal(d.walls.filter(w=>w.rooms.length===1&&w.opening?.kind==='door').length,1,d.id);
    for(let level=1;level<=d.levels;level++) {
      const rooms=d.rooms.filter(r=>(r.level ?? 1)===level);
      const reached=new Set([rooms.find(r=>r.id==='et')?.id ?? rooms.find(r=>r.code==='PORRAS')?.id ?? rooms[0].id]);
      for(let pass=0;pass<rooms.length;pass++) for(const w of d.walls.filter(w=>(w.level ?? 1)===level)) {
        if(w.opening&&w.opening.kind!=='window'&&w.rooms.some(r=>reached.has(r)))w.rooms.forEach(r=>reached.add(r));
      }
      assert.equal(reached.size,rooms.length,`${d.id}/L${level}`);
    }
    for(const w of d.walls)if(w.opening){assert.ok(w.opening.start>=w.start,d.id);assert.ok(w.opening.start+w.opening.width<=w.end,d.id);}
  }
});
test('bedrooms have exterior glazing and the intended room counts',()=>{
  const bedrooms={A12:1,A14:2,B24:2,C07:1,A31:3,D18:0,E05:2,C09:1,E15:2,F20:3};
  for(const d of Object.values(designs)) {
    const rooms=d.rooms.filter(r=>r.kind==='bedroom');
    assert.equal(rooms.length,bedrooms[d.id]);
    for(const r of rooms){assert.ok(roomArea(r)>=7,`${d.id}/${r.id}`);assert.ok(d.walls.some(w=>w.rooms.length===1&&w.rooms[0]===r.id&&w.opening?.kind==='window'),`${d.id}/${r.id}: missing daylight`);}
  }
});
test('all fixed and movable fittings stay inside their room footprints',()=>{
  for(const design of Object.values(designs))for(const f of design.fittings){const r=design.rooms.find(r=>r.id===f.room);assert.ok(r);const rotated=Math.abs(f.angle??0)%180===90;const w=rotated?f.d:f.w,depth=rotated?f.w:f.d;assert.ok(f.x>=r.x&&f.z>=r.z&&f.x+w<=r.x+r.w&&f.z+depth<=r.z+r.d,`${design.id}/${f.id}`);}
});
test('saunas exist only in sauna apartments and open into bathrooms',()=>{
  for(const d of Object.values(designs)){
    assert.equal(d.rooms.some(r=>r.kind==='sauna'),['A31','B24','E05'].includes(d.id));
    for(const w of d.walls.filter(w=>w.rooms.includes('s')&&w.opening?.kind==='door'))assert.ok(w.rooms.includes('kph'));
  }
});

test('showcase bedrooms connect directly to circulation and duplex stairs align', () => {
  for (const id of ['C09', 'E15', 'F20']) {
    const d = designs[id];
    for (const room of d.rooms.filter(r => r.kind === 'bedroom')) {
      const doors = d.walls.filter(w => w.rooms.includes(room.id) && w.opening?.kind === 'door');
      assert.ok(doors.some(w => w.rooms.some(id => d.rooms.find(r => r.id === id)?.kind === 'hall')), `${id}/${room.id} must open to a hall`);
    }
    if (d.levels < 2) continue;
    const stairs = d.rooms.filter(r => r.code === 'PORRAS');
    assert.equal(stairs.length, 2);
    for (const key of ['x', 'z', 'w', 'd']) assert.equal(stairs[0][key], stairs[1][key], `${id}: stair ${key}`);
    const p = stairProfile(d);
    assert.ok(p.tread >= .24 && p.rise <= .18, `${id}: usable demo stair proportions`);
    assert.equal(p.steps * 2 * p.rise, d.height / 1000 + .22);
  }
});
test('showcase footprints stay within published unit areas', () => {
  const expected = { C09: 56.5, E15: 77, F20: 92 };
  for (const [id, area] of Object.entries(expected)) {
    const design = designs[id];
    assert.ok(Math.abs((design.width * design.depth * design.levels) / 1e6 - area) < 0.1, `${id}: ${area} m²`);
  }
});
test('showcase doors have clear furniture approach zones', () => {
  for (const id of ['C09', 'E15', 'F20']) {
    const design = designs[id];
    for (const wall of design.walls.filter(w => w.rooms.length === 2 && w.opening?.kind === 'door')) {
      const opening = wall.opening;
      const clearance = wall.axis === 'x'
        ? { x: opening.start, z: wall.at - 700, w: opening.width, d: 1400 }
        : { x: wall.at - 700, z: opening.start, w: 1400, d: opening.width };
      for (const fitting of design.fittings.filter(f => wall.rooms.includes(f.room) && !['rug', 'stairs'].includes(f.kind))) {
        const rotated = Math.abs(fitting.angle ?? 0) % 180 === 90;
        const width = rotated ? fitting.d : fitting.w;
        const depth = rotated ? fitting.w : fitting.d;
        const overlaps = fitting.x < clearance.x + clearance.w && fitting.x + width > clearance.x && fitting.z < clearance.z + clearance.d && fitting.z + depth > clearance.z;
        assert.equal(overlaps, false, `${id}/${fitting.id} blocks ${wall.rooms.join('/')}`);
      }
    }
  }
});
test('showcase beds, wardrobes and kitchen cabinets do not intersect', () => {
  for (const id of ['C09', 'E15', 'F20']) {
    const design = designs[id];
    const footprint = fitting => {
      const rotated = Math.abs(fitting.angle ?? 0) % 180 === 90;
      return { x: fitting.x, z: fitting.z, w: rotated ? fitting.d : fitting.w, d: rotated ? fitting.w : fitting.d };
    };
    const intersects = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.z < b.z + b.d && a.z + a.d > b.z;
    for (const room of design.rooms) {
      const fittings = design.fittings.filter(fitting => fitting.room === room.id);
      const beds = fittings.filter(fitting => fitting.kind === 'bed');
      const wardrobes = fittings.filter(fitting => fitting.kind === 'wardrobe');
      for (const bed of beds) for (const wardrobe of wardrobes) {
        assert.equal(intersects(footprint(bed), footprint(wardrobe)), false, `${id}/${room.id}: bed intersects wardrobe`);
      }
      const kitchen = fittings.find(fitting => fitting.kind === 'kitchen');
      const fridge = fittings.find(fitting => fitting.kind === 'fridge');
      if (kitchen && fridge) assert.equal(intersects(footprint(kitchen), footprint(fridge)), false, `${id}/${room.id}: kitchen intersects fridge`);
      if (kitchen) for (const appliance of fittings.filter(fitting => ['sink', 'hob'].includes(fitting.kind))) {
        const cabinet = footprint(kitchen);
        const item = footprint(appliance);
        assert.ok(item.x >= cabinet.x && item.z >= cabinet.z && item.x + item.w <= cabinet.x + cabinet.w && item.z + item.d <= cabinet.z + cabinet.d, `${id}/${room.id}: ${appliance.kind} leaves kitchen run`);
      }
    }
  }
});
test('every showcase tour camera is inside its room and outside fittings', () => {
  for (const id of ['C09', 'E15', 'F20']) {
    const design = designs[id];
    for (const room of design.rooms) {
      const [x,,z] = cameraSpot(design, room.id).map(value => value * 1000);
      assert.ok(x > room.x && x < room.x + room.w && z > room.z && z < room.z + room.d, `${id}/${room.id}: camera outside room`);
      if (room.code === 'PORRAS') continue;
      for (const fitting of design.fittings.filter(fitting => fitting.room === room.id && fitting.kind !== 'rug')) {
        const rotated = Math.abs(fitting.angle ?? 0) % 180 === 90;
        const width = rotated ? fitting.d : fitting.w;
        const depth = rotated ? fitting.w : fitting.d;
        const inside = x > fitting.x && x < fitting.x + width && z > fitting.z && z < fitting.z + depth;
        assert.equal(inside, false, `${id}/${room.id}: camera inside ${fitting.kind}`);
      }
    }
  }
});
