// public/app.js
const el = id=>document.getElementById(id);
const promptIn = el('prompt');
const toneIn = el('tone');
const lengthIn = el('length');
const genBtn = el('generate');
const resEl = el('result');
const copyBtn = el('copy');
const dlBtn = el('download');
const saveBtn = el('save');


async function generate(){
const prompt = promptIn.value.trim();
if(!prompt){alert('Masukkan topik dulu');return}
genBtn.disabled = true; genBtn.textContent='Membuat...';
try{
const r = await fetch('/api/generate', {
method: 'POST',
headers: {'Content-Type':'application/json'},
body: JSON.stringify({ prompt, tone: toneIn.value, length: lengthIn.value })
});
const data = await r.json();
if(r.ok){
resEl.textContent = data.output;
saveBtn.disabled = false;
} else {
resEl.textContent = 'Error: ' + (data.error || JSON.stringify(data));
}
}catch(e){
resEl.textContent = 'Network error: ' + e.message;
} finally {
genBtn.disabled = false; genBtn.textContent='Generate';
}
}


copyBtn.onclick = ()=>{
navigator.clipboard.writeText(resEl.textContent).then(()=>alert('Teks disalin'))
}


dlBtn.onclick = ()=>{
const blob = new Blob([resEl.textContent],{type:'text/plain'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = 'kata-kata-galau.txt';
a.click(); URL.revokeObjectURL(url);
}


genBtn.onclick = generate;


// Optional: Save favorites to Firestore — implement if anda sudah setup firebase
saveBtn.onclick = async ()=>{
const text = resEl.textContent.trim();
if(!text) return alert('Tidak ada teks untuk disimpan');
// Implementasi Firestore minimal ada di README, atau gunakan fetch ke endpoint lain
alert('Fitur simpan: hubungkan Firestore (lihat README)');
}