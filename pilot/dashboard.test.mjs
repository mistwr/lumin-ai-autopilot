import test from 'node:test';
import assert from 'node:assert/strict';
import { dashboardForTenant, sampleDashboard } from './dashboard.mjs';
import { syntheticLeads } from './fixtures.mjs';
test('dashboard metrics are consistent', () => {
 const d=sampleDashboard();
 assert.deepEqual([d.total,d.qualified,d.followUp,d.notInterested,d.pendingHumanApproval],[3,1,1,1,2]);
 assert.equal(d.outboundEnabled,false);
});
test('tenant scope hides other companies', () => {
 const d=dashboardForTenant([...syntheticLeads,{...syntheticLeads[0],companyId:'other'}], 'other');
 assert.equal(d.total,1);assert.ok(d.leads.every(x=>x.companyId==='other'));
});
test('missing tenant rejected', () => assert.throws(()=>dashboardForTenant(syntheticLeads,'')));
