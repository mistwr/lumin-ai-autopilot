// On-demand server-side sandbox run. No external calls or personal data.
export default async function handler(request) {
 if(request.method!=='POST')return new Response(JSON.stringify({error:'POST required'}),{status:405,headers:{'content-type':'application/json'}});
 const origin=request.headers.get('origin');
 const site=new URL(request.url).origin;
 if(origin && origin!==site)return new Response(JSON.stringify({error:'Origin rejected'}),{status:403,headers:{'content-type':'application/json'}});
 let body;
 try {body=await request.json()}catch{return new Response(JSON.stringify({error:'Invalid JSON'}),{status:400})}
 const count=Number(body?.count),tenant=body?.tenant;
 if(!Number.isSafeInteger(count)||count<1||count>25||!['demo-a','demo-b'].includes(tenant))return new Response(JSON.stringify({error:'Invalid demo request'}),{status:400});
 const roles=['prospector','researcher','qualifier','copywriter','proposal','crm','supervisor'];
 const results=[];
 for(let i=1;i<=count;i++){
  const score=(i*17+23)%101;
  results.push({id:'SYN-'+i,score,qualified:score>=70,steps:roles.length,approval:'required'});
 }
 const response={mode:'server-sandbox',tenant,at:new Date().toISOString(),agents:roles,processed:results.length,steps:results.length*roles.length,qualified:results.filter(x=>x.qualified).length,externalActions:0,results};
 return new Response(JSON.stringify(response),{headers:{'content-type':'application/json','cache-control':'no-store','access-control-allow-origin':site}});
}
