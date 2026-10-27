import { runPilot } from './engine.mjs';
import { syntheticLeads } from './fixtures.mjs';
const results = runPilot(syntheticLeads);
console.log(JSON.stringify({ mode: 'offline-synthetic', outboundEnabled: false, results }, null, 2));
