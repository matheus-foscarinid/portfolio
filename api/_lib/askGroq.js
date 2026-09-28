/* eslint-env node */
import { GESTURES, buildSystemPrompt } from './profile.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-20b';
const MAX_REPLY_LENGTH = 600;

export class GroqLimitError extends Error {}

// the prompt asks for no dashes, but models still slip them in and they read as ai
const replaceDashes = (text) => text.replace(/\s*[\u2013\u2014]\s*/g, ', ');

const toAvatarReply = (content) => {
  const { reply, gesture } = JSON.parse(content);
  if (typeof reply !== 'string' || !reply.trim()) throw new Error('groq returned an empty reply');

  return {
    reply: replaceDashes(reply.trim()).slice(0, MAX_REPLY_LENGTH),
    gesture: GESTURES.includes(gesture) ? gesture : null,
  };
};

export const askGroq = async ({ messages, locale }) => {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not set');

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      messages: [{ role: 'system', content: buildSystemPrompt(locale) }, ...messages],
      response_format: { type: 'json_object' },
      reasoning_effort: 'low',
      include_reasoning: false,
      max_completion_tokens: 400,
      temperature: 0.6,
    }),
  });

  if (response.status === 429) throw new GroqLimitError('groq free tier limit reached');
  if (!response.ok) throw new Error(`groq responded ${response.status}: ${await response.text()}`);

  const { choices } = await response.json();
  return toAvatarReply(choices[0].message.content);
};
