// Isolated scheduled execution: synthetic inputs only, no external APIs or personal data.
const roles = Object.freeze(['prospector','researcher','qualifier','copywriter','proposal','crm','supervisor']);
function executeSandboxCycle() {
 const leads = Array.from({length:10},(_,i)=>({id:i+1,company:'Empresa fictícia '+(i+1),sector:i%2?'telecom':'energia'}));
 const audit=[];
 let qualified=0;
 for (const lead of leads) {
  const score=(lead.id*17+23)%101;
  if(score>=70)qualified++;
  for(const role of roles) audit.push({leadId:lead.id,role,status:'completed'});
 }
 return {leadsProcessed:leads.length,stepsExecuted:audit.length,qualified,approvalRequired:true,externalActions:0};
}
export default async function handler() {
 const cycle=executeSandboxCycle();
 const result={ok:true,mode:'synthetic-sandbox',at:new Date().toISOString(),cycle};
 console.log(JSON.stringify({event:'autopilot.sandbox_cycle',...result}));
 return new Response(JSON.stringify(result),{headers:{'content-type':'application/json','cache-control':'no-store'}});
}
export const config={schedule:'*/15 * * * *'};
