import test from "node:test";import assert from "node:assert/strict";
import {authorize,score,unitEconomics,runResearch} from "../src/engine.js";
test("blocks spending and publication",()=>{for(const type of ["spend","purchase","publish","paid-api","production-write","outbound"])assert.equal(authorize({type}).allowed,false)});
test("blocks positive-cost research",()=>assert.equal(authorize({type:"research",costEUR:0.01}).allowed,false));
test("allows free research",()=>assert.equal(authorize({type:"research",costEUR:0}).allowed,true));
test("missing evidence is explicit",()=>{const r=score({demand:null});assert.equal(r.complete,false);assert.ok(r.missing.includes("demand"))});
test("unit economics",()=>assert.equal(unitEconomics({price:30,cogs:10,shipping:5,targetCAC:5}).contribution,10));
test("deduplicates",()=>assert.equal(runResearch([{title:"A"},{title:"a"}]).length,1));
