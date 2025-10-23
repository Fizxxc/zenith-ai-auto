// api/generate.js
import fetch from 'node-fetch';


export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });


const { prompt, tone = 'galau', length = 'short' } = req.body || {};
if (!prompt) return res.status(400).json({ error: 'Prompt is required' });


try {
const messages = [
{ role: 'system', content: 'Kamu adalah penulis caption singkat yang puitis dan emosional untuk Sosial Media dalam bahasa Indonesia.' },
{ role: 'user', content: `Buat ${length} caption bertema "${prompt}" dengan nada ${tone}. Sertakan 1-3 variasi. Jangan sertakan kata "Caption:".` }
];


const r = await fetch('https://api.openai.com/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
},
body: JSON.stringify({ model: 'gpt-3.5-turbo', messages, max_tokens: 250, temperature: 0.9 })
});


if (!r.ok) {
const errText = await r.text();
console.error('OpenAI error', errText);
return res.status(502).json({ error: 'OpenAI API error', detail: errText });
}


const data = await r.json();
const text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';


return res.status(200).json({ output: text });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Server error', detail: String(err) });
}
}