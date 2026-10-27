export default async function handler() {
 const result = { ok:true, mode:'sandbox', at:new Date().toISOString(), agents:7, outbound:false, publishing:false };
 console.log(JSON.stringify(result));
 return new Response(JSON.stringify(result), {headers:{'content-type':'application/json'}});
}
export const config = {schedule:'*/15 * * * *'};
