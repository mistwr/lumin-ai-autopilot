import test from "node:test";
import assert from "node:assert/strict";
import { createEngine } from "../src/engine.mjs";
test("five isolated synthetic sessions with capacity enforcement", () => {
  const contacts = new Set(Array.from({ length: 6 }, (_, i) => "c" + i));
  const e = createEngine({ maxConcurrent: 5, authorizedContacts: contacts });
  for (let i = 0; i < 5; i++) e.start({ id: "s" + i, contactId: "c" + i, tenantId: "t" + i, consent: true });
  assert.equal(e.activeCount(), 5);
  assert.throws(() => e.start({ id: "s5", contactId: "c5", tenantId: "t5", consent: true }), /Concurrency/);
  e.utterance("s0", "t0", "customer", "Olá");
  assert.throws(() => e.utterance("s0", "t1", "agent", "Wrong tenant"), /not accessible/);
  assert.equal(e.finish("s0", "t0").transcript.length, 1);
  assert.equal(e.activeCount(), 4);
});
test("no session without explicit authorized contact", () => {
  const e = createEngine({ authorizedContacts: new Set(["allowed"]) });
  assert.throws(() => e.start({ id: "x", contactId: "unknown", tenantId: "t", consent: true }), /Consent/);
  assert.throws(() => e.start({ id: "x", contactId: "allowed", tenantId: "t", consent: false }), /Consent/);
});
