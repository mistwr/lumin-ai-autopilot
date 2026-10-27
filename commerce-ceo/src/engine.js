export const POLICY=Object.freeze({maxSpendEUR:0,allowProduction:false,allowPublish:false,allowOutbound:false});
export function authorize(action,policy=POLICY){
 const blocked=["purchase","spend","publish","outbound","production-write","live-checkout","paid-api"];
 if(blocked.includes(action.type))return {allowed:false,reason:"Default deny: "+action.type};
 if((action.costEUR??0)>policy.maxSpendEUR)return {allowed:false,reason:"Budget exceeded"};
 if(!["research","score","report","draft"].includes(action.type))return {allowed:false,reason:"Unknown action"};
 return {allowed:true};
}
export function score(p){
 const weights={demand:25,margin:25,shipping:15,differentiation:15,compliance:10,creative:10};
 const entries=Object.entries(weights);
 const missing=entries.filter(([k])=>p[k]===null||p[k]===undefined).map(([k])=>k);
 const total=entries.reduce((sum,[k,w])=>sum+(typeof p[k]==="number"?Math.max(0,Math.min(1,p[k]))*w:0),0);
 return {score:Math.round(total),missing,complete:missing.length===0};
}
export function unitEconomics({price,cogs,shipping,fees=0,returnsReserve=0,targetCAC=0}){
 const contribution=price-cogs-shipping-fees-returnsReserve-targetCAC;
 return {contribution:Math.round(contribution*100)/100,marginPercent:price>0?Math.round(contribution/price*10000)/100:null};
}
export function runResearch(candidates){
 const seen=new Set();const unique=candidates.filter(p=>{const key=p.title.trim().toLowerCase();if(seen.has(key))return false;seen.add(key);return true});
 return unique.map(p=>({...p,assessment:score(p),status:"research-only"})).sort((a,b)=>b.assessment.score-a.assessment.score);
}
