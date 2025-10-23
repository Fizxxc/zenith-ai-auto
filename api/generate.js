// api/generate.js — versi final (Edge Runtime)
export const config = { runtime: 'edge' };

/**
 * Vercel Edge Function — generator kata galau AI
 * Env required: OPENAI_API_KEY (optional: OPENAI_PROJECT_ID)
 */
export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Allow': 'POST', 'Content-Type': 'application/json' }
    });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await req.json();
    const { prompt, tone = 'galau', length = 'short' } = body;

    if (!prompt || !prompt.trim()) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build pesan ke OpenAI
    const systemMsg = {
      role: 'system',
      content:
        'Kamu adalah penulis kata-kata galau, puitis, dan emosional dalam bahasa Indonesia. Gaya khas untuk caption TikTok.'
    };

    const userMsg = {
      role: 'user',
      content: `Buatkan kata-kata galau dengan tema: \"${prompt}\". Nada: ${tone}. Panjang: ${length}. Beri 1–3 variasi singkat dan menyentuh hati.`
    };

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...(process.env.OPENAI_PROJECT_ID
          ? { 'OpenAI-Project': process.env.OPENAI_PROJECT_ID }
          : {})
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMsg, userMsg],
        temperature: 0.85,
        max_tokens: 250
      })
    });

    const data = await resp.json();
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: 'OpenAI API error', details: data }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = data?.choices?.[0]?.message?.content?.trim() || 'Tidak ada hasil.';

    return new Response(JSON.stringify({ output: result, raw: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[ERROR]', err);
    return new Response(JSON.stringify({ error: 'Server error', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
