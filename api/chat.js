import { GroqLimitError, askGroq } from './_lib/askGroq.js';
import { createRateLimiter } from './_lib/createRateLimiter.js';
import { parseChatRequest } from './_lib/parseChatRequest.js';

const isAllowed = createRateLimiter({ limit: 8, windowMs: 60_000 });

const getClientIp = (request) =>
  request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

const readJson = (request) => request.json().catch(() => null);

export async function POST(request) {
  if (!isAllowed(getClientIp(request))) return Response.json({ error: 'rate_limited' }, { status: 429 });

  const chat = parseChatRequest(await readJson(request));
  if (!chat) return Response.json({ error: 'invalid_request' }, { status: 400 });

  try {
    return Response.json(await askGroq(chat));
  } catch (error) {
    if (error instanceof GroqLimitError) return Response.json({ error: 'rate_limited' }, { status: 429 });
    console.error(error);
    return Response.json({ error: 'unavailable' }, { status: 502 });
  }
}
