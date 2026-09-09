import test from 'node:test';
import assert from 'node:assert/strict';
import { matchHome } from '../lib/matcher.ts';
import { apartments } from '../lib/data.ts';
test('matcher penalizes budget, household and room shortfalls with honest explanations', () => {
  const home = apartments.find(a => a.id === 'C09');
  const fit = matchHome(home, {budget:'1200', rooms:'2', people:'2'});
  const mismatch = matchHome(home, {budget:'700', rooms:'4+', people:'4+'});
  assert.equal(fit.score, 100);
  assert.equal(mismatch.score, 0);
  assert.equal(mismatch.tradeoffs.length, 3);
  assert.equal(mismatch.reasons.length, 0);
});
test('accessibility and parking needs are not ignored', () => {
  const unavailable = {...apartments[0], accessible:false, parking:false, ev:false, pets:false};
  assert.equal(matchHome(unavailable,{accessible:'yes',car:'yes',ev:'yes',pets:'yes'}).score,0);
  assert.equal(matchHome(apartments[0],{accessible:'yes',car:'yes',ev:'yes',pets:'yes'}).score,100);
});
