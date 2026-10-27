/* Lumin Autopilot agents v0.1: deterministic real execution on synthetic data.
   No network, credentials, real customer data, outbound contact or publication. */
(function(){
'use strict';
const roles=[
  {id:'prospector',name:'Prospector',run:(lead)=>({company:lead.company,sector:lead.sector,source:'dados fictícios'})},
  {id:'researcher',name:'Investigador',run:(lead)=>({needs:lead.sector==='energia'?'análise de consumo':'comparação de serviços',confidence:0.7})},
  {id:'qualifier',name:'Qualificador',run:(lead)=>({score:(lead.index*17+23)%101,segment:lead.index%2?'B2B':'B2C'})},
  {id:'copywriter',name:'Marketing',run:(lead)=>({draft:'Olá, '+lead.company+'. Podemos apresentar uma comparação sem compromisso?',status:'rascunho não enviado'})},
  {id:'proposal',name:'Propostas',run:(lead)=>({proposal:'Proposta de demonstração para '+lead.company,price:null,status:'rascunho não enviado'})},
  {id:'crm',name:'CRM',run:(lead)=>({recordId:'SIM-'+lead.index,status:'simulado, sem escrita externa'})},
  {id:'supervisor',name:'Supervisor',run:(lead)=>({review:'revisão humana obrigatória',next:'awaiting_approval'})}
];
const state={runs:[],paused:false};
function start({tenant,name,count}){
 if(!/^(demo-a|demo-b)$/.test(tenant))throw Error('Empresa inválida');
 if(!name||name.length>64)throw Error('Campanha inválida');
 if(!Number.isSafeInteger(count)||count<1||count>500)throw Error('Quantidade inválida');
 if(state.paused)throw Error('Motor pausado');
 const run={id:'SIM-'+(state.runs.length+1),tenant,name,count,status:'running',createdAt:new Date().toISOString(),steps:[],metrics:{processed:0,interested:0,calls:0,messages:0,sales:0}};
 state.runs.push(run);
 const startAt=Date.now();
 for(let i=1;i<=count;i++){
  if(state.paused){run.status='paused';break;}
  const lead={index:i,company:'Empresa fictícia '+i,sector:i%2?'energia':'telecom'};
  const output={};
  for(const agent of roles){
   const result=agent.run(lead,output);
   output[agent.id]=result;
   run.steps.push({leadId:'LEAD-'+i,agent:agent.id,result});
  }
  run.metrics.processed++;
  if(output.qualifier.score>=70)run.metrics.interested++;
 }
 if(run.status==='running')run.status='awaiting_approval';
 run.durationMs=Date.now()-startAt;
 return run;
}
function pause(){state.paused=true}
function resume(){state.paused=false}
window.LuminAgents=Object.freeze({roles:roles.map(({id,name})=>({id,name})),start,pause,resume,getState:()=>JSON.parse(JSON.stringify(state))});
})();