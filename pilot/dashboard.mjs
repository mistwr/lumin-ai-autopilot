import { runPilot } from './engine.mjs';
import { syntheticLeads } from './fixtures.mjs';
export function dashboardForTenant(leads, tenantId) {
 if (typeof tenantId !== 'string' || !tenantId.trim()) throw new Error('Tenant required');
 const scoped = leads.filter(x => x.companyId === tenantId);
 const results = runPilot(scoped);
 return { tenantId, mode: 'synthetic-offline', total: results.length,
   qualified: results.filter(x => x.status === 'qualified').length,
   followUp: results.filter(x => x.status === 'follow_up').length,
   notInterested: results.filter(x => x.status === 'not_interested').length,
   pendingHumanApproval: results.filter(x => x.approvalRequired).length,
   outboundEnabled: false, leads: results };
}
export const sampleDashboard = () => dashboardForTenant(syntheticLeads, 'demo-company');
