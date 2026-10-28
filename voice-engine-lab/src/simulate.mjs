import { createEngine } from "./engine.mjs";
const contacts = new Set(Array.from({ length: 5 }, (_, i) => "synthetic-" + i));
const engine = createEngine({ maxConcurrent: 5, authorizedContacts: contacts });
for (let i = 0; i < 5; i++) {
  engine.start({ id: "session-" + i, contactId: "synthetic-" + i, tenantId: "lab", consent: true });
  engine.utterance("session-" + i, "lab", "customer", "Gostaria de saber as condições.");
  engine.utterance("session-" + i, "lab", "agent", "Claro. Qual é a sua operadora atual?");
}
console.log(JSON.stringify({ mode: "synthetic-only", simultaneousSessions: engine.activeCount(), externalCalls: 0, paidProviders: 0 }));
for (let i = 0; i < 5; i++) engine.finish("session-" + i, "lab");
