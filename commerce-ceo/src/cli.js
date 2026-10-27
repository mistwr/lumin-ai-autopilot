import {readFileSync} from "node:fs";
import {runResearch,POLICY} from "./engine.js";
const input=process.argv[2]??new URL("../fixtures/candidates.json",import.meta.url);
const candidates=JSON.parse(readFileSync(input,"utf8"));
console.log(JSON.stringify({mode:"research-only",policy:POLICY,count:candidates.length,ranked:runResearch(candidates)},null,2));
