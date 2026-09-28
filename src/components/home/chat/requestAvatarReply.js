export class AvatarChatError extends Error {
  constructor(code) {
    super(`avatar chat failed: ${code}`);
    this.code = code;
  }
}

export const requestAvatarReply = async ({ messages, locale }) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, locale }),
  }).catch(() => {
    throw new AvatarChatError('unavailable');
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new AvatarChatError(body.error === 'rate_limited' ? 'rate_limited' : 'unavailable');
  return body;
};
