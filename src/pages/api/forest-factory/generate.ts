import type { APIRoute } from 'astro';
import { generateMockTest } from '../../../lib/forest-factory';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { generators, seed, count } = body;

    if (!Array.isArray(generators) || generators.length === 0) {
      return new Response(JSON.stringify({ error: 'generators must be a non-empty array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (typeof seed !== 'number') {
      return new Response(JSON.stringify({ error: 'seed must be a number' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (typeof count !== 'number' || count < 1 || count > 100) {
      return new Response(JSON.stringify({ error: 'count must be a number between 1 and 100' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return raw quiz data - client handles markdown and KaTeX rendering
    const quiz = generateMockTest(generators, seed, count);

    return new Response(JSON.stringify(quiz), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate quiz' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
