// Provider-neutral browser-audio integration contract. No external calls.
export class VoiceAdapter {
  async connect(_session) { throw new Error("Implement connect()"); }
  async receiveAudio(_sessionId, _chunk) { throw new Error("Implement receiveAudio()"); }
  async sendAudio(_sessionId, _chunk) { throw new Error("Implement sendAudio()"); }
  async disconnect(_sessionId) { throw new Error("Implement disconnect()"); }
}
export class MockVoiceAdapter extends VoiceAdapter {
  constructor() { super(); this.sessions = new Map(); }
  async connect(session) {
    if (!session?.id) throw new Error("Missing session id");
    if (this.sessions.has(session.id)) throw new Error("Duplicate audio session");
    this.sessions.set(session.id, { incoming: [], outgoing: [] });
  }
  async receiveAudio(id, chunk) {
    const s = this.sessions.get(id);
    if (!s) throw new Error("Unknown audio session");
    if (!(chunk instanceof Uint8Array) || chunk.length === 0) throw new Error("Invalid audio chunk");
    s.incoming.push(new Uint8Array(chunk));
  }
  async sendAudio(id, chunk) {
    const s = this.sessions.get(id);
    if (!s) throw new Error("Unknown audio session");
    if (!(chunk instanceof Uint8Array) || chunk.length === 0) throw new Error("Invalid audio chunk");
    s.outgoing.push(new Uint8Array(chunk));
  }
  async disconnect(id) { this.sessions.delete(id); }
  stats(id) {
    const s = this.sessions.get(id);
    if (!s) throw new Error("Unknown audio session");
    return { receivedChunks: s.incoming.length, sentChunks: s.outgoing.length };
  }
}
