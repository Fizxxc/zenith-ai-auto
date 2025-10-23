const $ = (id) => document.getElementById(id);
const promptIn = $('prompt');
const toneIn = $('tone');
const lengthIn = $('length');
const genBtn = $('generate');
const resultEl = $('result');
const copyBtn = $('copy');
const dlBtn = $('download');
const saveBtn = $('save');

async function generate() {
  const prompt = promptIn.value.trim();
  if (!prompt) return alert('Masukin topik yang pengen di generate dulu ya kak! 😊');

  genBtn.disabled = true;
  genBtn.textContent = 'HEHEHE LAGI DI BIKIN YA KAK...';
  resultEl.textContent = '⏳ Sabar ya kak...';

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        tone: toneIn.value,
        length: lengthIn.value
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Yahh gagal nih, coba lagi ya.');

    resultEl.textContent = data.output;
    saveBtn.disabled = false;
  } catch (err) {
    resultEl.textContent = '❌ Error: ' + err.message;
  } finally {
    genBtn.disabled = false;
    genBtn.textContent = 'Generate';
  }
}

genBtn.onclick = generate;

copyBtn.onclick = () => {
  navigator.clipboard.writeText(resultEl.textContent);
  alert('📋 Disalin ke clipboard!');
};

dlBtn.onclick = () => {
  const blob = new Blob([resultEl.textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'zenith-ai.txt';
  a.click();
  URL.revokeObjectURL(url);
};

saveBtn.onclick = () => {
  alert('💾 Fitur simpan ke Firebase coming soon!');
};
