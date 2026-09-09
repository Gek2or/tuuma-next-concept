import type { Apartment } from './data';

export type MatchReason = { fi: string; en: string; sv: string };
/** Transparent demo rules. Scores measure selected preferences, not eligibility. */
export function matchHome(home: Apartment, answers: Record<string, string>) {
  let total = 0, earned = 0;
  const reasons: MatchReason[] = [], tradeoffs: MatchReason[] = [];
  function check(weight: number, value: boolean, yes: MatchReason, no: MatchReason) {
    total += weight; if (value) { earned += weight; reasons.push(yes); } else tradeoffs.push(no);
  }
  const areas: Record<string, string> = { hyryla: 'Hyrylä', jokela: 'Jokela', kellokoski: 'Kellokoski' };
  if (areas[answers.area]) check(20, home.area === areas[answers.area], {fi:'Toivomasi alue',en:'Your preferred area',sv:'Ditt önskade område'}, {fi:'Eri alue kuin toiveesi',en:'Outside your preferred area',sv:'Annat område än önskat'});
  const budget = Number(answers.budget);
  if (budget) check(25, home.rent <= budget, {fi:'Vuokra budjettisi sisällä',en:'Rent within your budget',sv:'Hyran inom din budget'}, {fi:'Vuokra ylittää budjettisi',en:'Rent exceeds your budget',sv:'Hyran överskrider din budget'});
  const rooms = parseInt(answers.rooms), people = parseInt(answers.people);
  if (rooms) check(20, home.rooms >= rooms, {fi:'Riittävä huonemäärä',en:'Enough rooms',sv:'Tillräckligt många rum'}, {fi:'Toivottua vähemmän huoneita',en:'Fewer rooms than requested',sv:'Färre rum än önskat'});
  if (people) check(10, home.size >= people * 16, {fi:'Tilaa kotitaloudellesi',en:'Space for your household',sv:'Utrymme för ditt hushåll'}, {fi:'Tiivis vaihtoehto kotitaloudellesi',en:'A compact option for your household',sv:'Ett kompakt alternativ för ditt hushåll'});
  const needs = [
    ['accessible', home.accessible, 'Esteettömyys', 'Accessibility', 'Tillgänglighet', 25],
    ['car', home.parking, 'Autopaikka', 'Parking', 'Bilplats', 8],
    ['ev', home.ev, 'Sähköauton lataus', 'EV charging', 'Elbilsladdning', 8],
    ['pets', home.pets, 'Lemmikit sallittu', 'Pets allowed', 'Husdjur tillåtna', 15],
  ] as const;
  for (const [key, available, fi, en, sv, weight] of needs) if (answers[key] === 'yes') check(weight, available, {fi,en,sv}, {fi:`${fi}: ei saatavilla`,en:`${en}: unavailable`,sv:`${sv}: inte tillgängligt`});
  if (answers.transit && answers.transit !== 'no') check(answers.transit === 'high' ? 15 : 5, home.transport <= 10, {fi:'Pysäkki enintään 10 min kävellen',en:'Stop within a 10 min walk',sv:'Hållplats inom 10 min till fots'}, {fi:'Pysäkille yli 10 min kävellen',en:'Over 10 min walk to the stop',sv:'Över 10 min till hållplatsen'});
  return { ...home, score: total ? Math.round(100 * earned / total) : 0, reasons, tradeoffs };
}
