import test from 'node:test';
import assert from 'node:assert/strict';
import { qualify, runPilot } from './engine.mjs';
import { syntheticLeads } from './fixtures.mjs';
test('three deterministic outcomes without outbound activity', () => {
 const result = runPilot(syntheticLeads);
 assert.deepEqual(result.map(x => x.status), ['qualified', 'follow_up', 'not_interested']);
 assert.ok(result.every(x => x.outboundEnabled === false));
});
test('invalid financial values rejected', () => {
 assert.throws(() => qualify({ ...syntheticLeads[0], monthlySpend: -1 }));
});
test('duplicate lead within tenant rejected', () => {
 assert.throws(() => runPilot([syntheticLeads[0], syntheticLeads[0]]));
});
test('same lead id in different tenants remains isolated', () => {
 const result = runPilot([syntheticLeads[0], {...syntheticLeads[0], companyId:'another-demo'}]);
 assert.equal(result.length, 2);
});
