export function getSessionId(): string {
  let sessionId = localStorage.getItem('reflect_session_id');
  
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('reflect_session_id', sessionId);
  }
  
  return sessionId;
}

function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function clearSessionId(): void {
  localStorage.removeItem('reflect_session_id');
}
