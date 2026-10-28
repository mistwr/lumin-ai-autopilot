// Deterministic, offline commercial qualification. No network or personal data.
export function qualify(lead) {
  if (!lead || typeof lead !== 'object' || !lead.id || !lead.companyId) throw new Error('Invalid lead');
  const { operator, monthlySpend, contractMonthsRemaining, wantsComparison } = lead;
  if (typeof monthlySpend !== 'number' || !Number.isFinite(monthlySpend) || monthlySpend < 0) throw new Error('Invalid monthlySpend');
  if (!Number.isInteger(contractMonthsRemaining) || contractMonthsRemaining < 0) throw new Error('Invalid contractMonthsRemaining');
  if (typeof wantsComparison !== 'boolean') throw new Error('Invalid wantsComparison');
  const status = !wantsComparison ? 'not_interested' : contractMonthsRemaining > 6 ? 'follow_up' : 'qualified';
  const nextAction = status === 'qualified' ? 'prepare_human_review' : status === 'follow_up' ? 'schedule_consent_based_follow_up' : 'close_without_contact';
  return { leadId: lead.id, companyId: lead.companyId, status, nextAction, summary: { operator: String(operator ?? 'unknown'), monthlySpend, contractMonthsRemaining }, approvalRequired: status !== 'not_interested', outboundEnabled: false };
}
export function runPilot(leads) {
  if (!Array.isArray(leads)) throw new Error('Expected leads array');
  const ids = new Set();
  return leads.map(lead => {
    const key = String(lead.companyId) + ':' + String(lead.id);
    if (ids.has(key)) throw new Error('Duplicate tenant lead');
    ids.add(key);
    return qualify(lead);
  });
}
