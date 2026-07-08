const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add "Notas" button to the Nav Group
const navTarget = '<button data-view="timeline">Linha do tempo</button>';
if (html.includes(navTarget)) {
    html = html.replace(navTarget, navTarget + '\n<button data-view="notas">Relatórios</button>');
} else {
    // If it was changed to "Timeline" in the light mode/dark mode reset
    const navTarget2 = '<button data-view="timeline">Timeline</button>';
    if(html.includes(navTarget2)) {
         html = html.replace(navTarget2, navTarget2 + '\n<button data-view="notas">Relatórios</button>');
    } else {
         // just inject after "agora"
         html = html.replace('<button data-view="agora">Radar</button>', '<button data-view="agora">Radar</button>\n<button data-view="notas">Relatórios</button>');
    }
}

// 2. Add the Notes Section
const notesSection = `
<section class="section" id="notas" style="display:none;">
    <div class="sectionHead">
        <div>
            <h2>Terminal de Relatórios</h2>
            <div class="mini">Bloco de notas integrado com salvamento direto no Firebase.</div>
        </div>
        <span class="chip cyan">Cloud Sync</span>
    </div>
    <div class="panel" style="padding: 24px; border-color: var(--text-primary);">
        <textarea id="notaTexto" rows="18" placeholder="> INICIE A DIGITAÇÃO DO RELATÓRIO AQUI..." style="width: 100%; font-family: var(--font-mono); background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border); padding: 16px; resize: vertical; outline: none; margin-bottom: 16px;"></textarea>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="mini" id="notaStatus" style="font-family: var(--font-mono); color: #4caf50; display:none;">> [ OK ] DADOS SINCRONIZADOS COM A NUVEM.</span>
            <button class="btn" id="btnSalvarNota" style="font-family: var(--font-mono);">[ EXECUTAR SALVAMENTO ]</button>
        </div>
    </div>
</section>
`;
// Inject right before the closing tag of the #app div or loginGate
html = html.replace('<div class="loginGate"', notesSection + '\n<div class="loginGate"');


// 3. Inject JS Logic into the main module script
// We need to inject inside the <script type="module"> before it closes.
const scriptLogic = `
// --- NOTAS / RELATORIOS LOGIC ---
const notaTexto = document.getElementById('notaTexto');
const btnSalvarNota = document.getElementById('btnSalvarNota');
const notaStatus = document.getElementById('notaStatus');

if (notaTexto && btnSalvarNota) {
    // Load existing note on start
    onSnapshot(doc(db, "entries", "rascunho_relatorio"), (docSnap) => {
        if (docSnap.exists() && document.activeElement !== notaTexto) {
            notaTexto.value = docSnap.data().texto || "";
        }
    });

    btnSalvarNota.addEventListener('click', async () => {
        try {
            btnSalvarNota.innerText = '[ ENVIANDO... ]';
            await setDoc(doc(db, "entries", "rascunho_relatorio"), {
                texto: notaTexto.value,
                updatedAt: serverTimestamp()
            }, { merge: true });
            
            btnSalvarNota.innerText = '[ EXECUTAR SALVAMENTO ]';
            notaStatus.innerText = '> [ OK ] RELATORIO SALVO NO FIREBASE.';
            notaStatus.style.display = 'block';
            notaStatus.style.color = '#4caf50';
            setTimeout(() => { notaStatus.style.display = 'none'; }, 4000);
        } catch (e) {
            console.error(e);
            notaStatus.innerText = '> [ ERRO ] FALHA NA CONEXAO.';
            notaStatus.style.display = 'block';
            notaStatus.style.color = '#ff4444';
        }
    });
}
`;

// Find the last </script> which is the module closing tag, and inject before it
const lastScriptIdx = html.lastIndexOf('</script>');
if (lastScriptIdx !== -1) {
    html = html.substring(0, lastScriptIdx) + scriptLogic + html.substring(lastScriptIdx);
}

fs.writeFileSync('index.html', html);
console.log('Firebase Notes UI and Logic injected.');
