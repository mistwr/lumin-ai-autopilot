export function createEngine({ maxConcurrent = 5, authorizedContacts = new Set() } = {}) {
  if (!Number.isInteger(maxConcurrent) || maxConcurrent < 1) throw new Error("Invalid concurrency limit");
  const sessions = new Map();
  function start({ id, contactId, tenantId, consent = false }) {
    if (!id || !contactId || !tenantId) throw new Error("Missing required identity");
    if (!consent || !authorizedContacts.has(contactId)) throw new Error("Consent not verified");
    if (sessions.has(id)) throw new Error("Duplicate session");
    if (sessions.size >= maxConcurrent) throw new Error("Concurrency limit reached");
    const session = { id, contactId, tenantId, status: "active", transcript: [], startedAt: Date.now() };
    sessions.set(id, session);
    return structuredClone(session);
  }
  function utterance(id, tenantId, speaker, message) {
    const session = sessions.get(id);
    if (!session || session.tenantId !== tenantId) throw new Error("Session not accessible");
    if (!["agent", "customer"].includes(speaker) || typeof message !== "string" || !message.trim()) throw new Error("Invalid utterance");
    session.transcript.push({ speaker, message, at: Date.now() });
    return session.transcript.length;
  }
  function finish(id, tenantId) {
    const session = sessions.get(id);
    if (!session || session.tenantId !== tenantId) throw new Error("Session not accessible");
    sessions.delete(id);
    return { ...structuredClone(session), status: "finished", finishedAt: Date.now() };
  }
  return { start, utterance, finish, activeCount: () => sessions.size };
}
