import assert from 'node:assert/strict';
import test from 'node:test';
import { designs, roomArea, stairProfile } from '../lib/architecture.ts';

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
  for(const d of Object.values(designs))for(const f of d.fittings){const r=d.rooms.find(r=>r.id===f.room);assert.ok(r);assert.ok(f.x>=r.x&&f.z>=r.z&&f.x+f.w<=r.x+r.w&&f.z+f.d<=r.z+r.d,`${d.id}/${f.id}`);}
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
