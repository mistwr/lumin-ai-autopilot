import test from "node:test";
import assert from "node:assert/strict";
import { MockVoiceAdapter } from "../src/voice-adapter.mjs";
test("five mock audio streams stay isolated", async () => {
  const adapter = new MockVoiceAdapter();
  for (let i=0;i<5;i++) {
    const id = "session-"+i;
    await adapter.connect({id});
    await adapter.receiveAudio(id, new Uint8Array([i+1]));
    await adapter.sendAudio(id, new Uint8Array([i+2]));
  }
  for (let i=0;i<5;i++) assert.deepEqual(adapter.stats("session-"+i), {receivedChunks:1,sentChunks:1});
  await assert.rejects(adapter.receiveAudio("missing",new Uint8Array([1])),/Unknown/);
  for (let i=0;i<5;i++) await adapter.disconnect("session-"+i);
});
