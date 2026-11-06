'use strict';
/* Esboço: os dados ficam no navegador e o login é simulado. Nada aqui vale como autenticação real. */
const CHAVE = 'central-tcc-v2', SESSAO = 'central-tcc-sessao', SENHA = '1234';
const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const PAPEL = { aluno: 'Aluno', orientador: 'Orientação', coordenador: 'Coordenação', banca: 'Banca' };
const NAV_ACOMPANHA = [['inicio','Início','casa'],['entregas','Entregas','arquivo'],['agenda','Agenda','calendario'],['chat','Bate-papo','balao'],['biblioteca','Biblioteca','livro']];
const NAV = {
  aluno: NAV_ACOMPANHA,
  orientador: NAV_ACOMPANHA,
  coordenador: [['alunos','Alunos','pessoas'],['prazos','Prazos','relogio'],['chat','Bate-papo','balao'],['biblioteca','Biblioteca','livro']],
  banca: [['entregas','Entregas','arquivo'],['chat','Bate-papo','balao'],['biblioteca','Biblioteca','livro']]
};
const ICONES = {
  casa: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  arquivo: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/>',
  calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  balao: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  livro: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  pessoas: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.4a6.5 6.5 0 0 1 3.5 5.6"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sair: '<path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H9"/>',
  busca: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  subir: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  olho: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
  esquerda: '<path d="m15 6-6 6 6 6"/>',
  direita: '<path d="m9 6 6 6-6 6"/>',
  baixo: '<path d="m6 9 6 6 6-6"/>',
  salvar: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>',
  clipe: '<path d="m21 11-8.6 8.6a5.5 5.5 0 0 1-7.8-7.8l8.9-8.9a3.7 3.7 0 0 1 5.2 5.2l-8.9 8.9a1.8 1.8 0 0 1-2.6-2.6l8.1-8.1"/>',
  copiar: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  filtro: '<path d="M3 6h18M7 12h10M10 18h4"/>'
};
const ic = (n, s) => `<svg class="ic" width="${s || 18}" height="${s || 18}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[n]}</svg>`;
const esc = s => String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const novoId = () => Math.random().toString(36).slice(2, 10);
/* Texto sem acento e em minúsculas: "visao" encontra "Visão". */
const norm = s => String(s === undefined || s === null ? '' : s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function marcar(txt, q) {
  const s = String(txt), termos = norm(q).split(/\s+/).filter(t => t.length > 1), base = Array.from(s, c => norm(c) || c).join('');
  if (!termos.length || base.length !== s.length) return esc(s);
  const trechos = [];
  termos.forEach(t => { for (let i = base.indexOf(t); i >= 0; i = base.indexOf(t, i + 1)) trechos.push([i, i + t.length]); });
  trechos.sort((a, b) => a[0] - b[0]);
  let out = '', pos = 0;
  trechos.forEach(([a, b]) => { if (a < pos) return; out += `${esc(s.slice(pos, a))}<mark>${esc(s.slice(a, b))}</mark>`; pos = b; });
  return out + esc(s.slice(pos));
}

/* Datas */
const hoje = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const paraIso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const emDias = n => { const d = hoje(); d.setDate(d.getDate() + n); return paraIso(d); };
const deIso = s => new Date(s + 'T12:00:00');
const diasAte = s => Math.round((deIso(s) - new Date(hoje().getTime() + 432e5)) / 864e5);
const dia = s => { const d = deIso(s); return `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`; };
const quando = s => { const n = diasAte(s); return n === 0 ? 'hoje' : n === 1 ? 'amanhã' : n === -1 ? 'ontem' : n > 0 ? `em ${n} dias` : `há ${-n} dias`; };
const diaDe = ms => dia(paraIso(new Date(ms)));
const momento = ms => {
  const d = new Date(ms), h = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return paraIso(d) === paraIso(new Date()) ? h : `${diaDe(ms)}, ${h}`;
};
const nota = n => n === null || n === undefined ? '–' : Number(n).toFixed(1).replace('.', ',');
const tamanho = b => b > 1048576 ? `${(b / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;

/* Arquivos enviados ficam no IndexedDB do navegador, que aguenta PDFs grandes. */
const arquivos = {
  abrir() {
    return new Promise((ok, erro) => {
      const pedido = indexedDB.open('central-tcc-arquivos', 1);
      pedido.onupgradeneeded = () => pedido.result.createObjectStore('arquivos');
      pedido.onsuccess = () => ok(pedido.result);
      pedido.onerror = () => erro(pedido.error);
    });
  },
  guardar(id, blob) {
    return this.abrir().then(base => new Promise(ok => {
      const tx = base.transaction('arquivos', 'readwrite');
      tx.objectStore('arquivos').put(blob, id);
      tx.oncomplete = () => ok();
      tx.onerror = () => ok();
    })).catch(() => {});
  },
  ler(id) {
    return this.abrir().then(base => new Promise(ok => {
      const pedido = base.transaction('arquivos').objectStore('arquivos').get(id);
      pedido.onsuccess = () => ok(pedido.result || null);
      pedido.onerror = () => ok(null);
    })).catch(() => null);
  }
};
function salvarArquivo(blob, nome) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = nome;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}
function copiar(texto) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(texto).catch(() => copiarAntigo(texto));
  return Promise.resolve(copiarAntigo(texto));
}
function copiarAntigo(texto) {
  const t = document.createElement('textarea');
  t.value = texto; document.body.appendChild(t); t.select();
  document.execCommand('copy'); t.remove();
}
/* PDF de uma página para os trabalhos de exemplo, que não têm arquivo de verdade. */
function pdfSimples(blocos) {
  const hex = t => `<${Array.from(t, c => { const n = c.charCodeAt(0); return (n < 256 ? n : 45).toString(16).padStart(2, '0'); }).join('')}>`;
  const quebrar = (t, max) => t.split(' ').reduce((l, p) => { const u = l[l.length - 1]; if ((u + ' ' + p).trim().length > max) l.push(p); else l[l.length - 1] = (u + ' ' + p).trim(); return l; }, ['']);
  let y = 770, c = 'BT\n';
  blocos.forEach(b => {
    quebrar(b.t, Math.floor(475 / (b.s * 0.52))).forEach(l => { c += `/${b.b ? 'F2' : 'F1'} ${b.s} Tf 1 0 0 1 60 ${y} Tm ${hex(l)} Tj\n`; y -= b.s * 1.45; });
    y -= b.m || 0;
  });
  c += 'ET';
  const objs = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    `<< /Length ${c.length} >>\nstream\n${c}\nendstream`];
  let out = '%PDF-1.4\n';
  const pos = objs.map((o, i) => { const p = out.length; out += `${i + 1} 0 obj\n${o}\nendobj\n`; return p; });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${pos.map(p => `${String(p).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([out], { type: 'application/pdf' });
}

/* Armazenamento */
function ler() { try { const s = localStorage.getItem(CHAVE); if (s) return JSON.parse(s); } catch (e) {} return exemplo(); }
function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(db)); } catch (e) {} }
let sessaoMemoria = null;
function sessao(id) {
  if (id !== undefined) {
    sessaoMemoria = id;
    try { id ? sessionStorage.setItem(SESSAO, id) : sessionStorage.removeItem(SESSAO); } catch (e) {}
    return id;
  }
  try { return sessionStorage.getItem(SESSAO) || sessaoMemoria; } catch (e) { return sessaoMemoria; }
}
let db = ler();
const estado = { mes: new Date(hoje().getFullYear(), hoje().getMonth(), 1), busca: '', curso: '', ano: '' };

/* Consultas */
const pessoa = id => db.usuarios.find(u => u.id === id);
const nomeDe = id => { const p = pessoa(id); return p ? p.nome : ''; };
const eu = () => pessoa(sessao());
const itens = () => db.itens.slice().sort((a, b) => a.prazo.localeCompare(b.prazo));
const item = id => db.itens.find(i => i.id === id);
const trabalho = id => db.trabalhos.find(t => t.id === id);
const doAluno = id => db.trabalhos.find(t => t.alunoId === id);
const alunoDe = t => pessoa(t.alunoId);
function visiveis(u) {
  if (u.papel === 'aluno') return db.trabalhos.filter(t => t.alunoId === u.id);
  if (u.papel === 'orientador') return db.trabalhos.filter(t => t.orientadorId === u.id);
  if (u.papel === 'banca') return db.trabalhos.filter(t => t.bancaIds.includes(u.id));
  return db.trabalhos;
}
const enviosDe = (tid, iid) => db.envios.filter(e => e.tid === tid && e.iid === iid).sort((a, b) => b.data - a.data);
const feedbacksDe = (tid, iid) => db.feedbacks.filter(f => f.tid === tid && (!iid || f.iid === iid)).sort((a, b) => b.data - a.data);
const enviadas = t => db.itens.filter(i => enviosDe(t.id, i.id).length).length;
function media(tid, iid) {
  const porAutor = {};
  feedbacksDe(tid, iid).forEach(f => { if (f.nota !== null && f.nota !== undefined && !(f.autorId in porAutor)) porAutor[f.autorId] = f.nota; });
  const v = Object.values(porAutor);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}
function situacao(t, i) {
  const envs = enviosDe(t.id, i.id), fbs = feedbacksDe(t.id, i.id);
  if (envs.length && fbs.length && fbs[0].data >= envs[0].data) return { txt: 'Com feedback', cor: 'verde' };
  if (envs.length) return { txt: 'Enviada', cor: 'azul' };
  const n = diasAte(i.prazo);
  if (n < 0) return { txt: 'Atrasada', cor: 'vermelho' };
  if (n <= 7) return { txt: n === 0 ? 'Vence hoje' : n === 1 ? 'Vence amanhã' : `Vence em ${n} dias`, cor: 'ambar' };
  return { txt: 'A entregar', cor: 'cinza' };
}
function aguardaMeu(u, t, i) {
  const envs = enviosDe(t.id, i.id);
  return !!envs.length && !feedbacksDe(t.id, i.id).some(f => f.autorId === u.id && f.data >= envs[0].data);
}
const qtdAguardando = u => visiveis(u).reduce((s, t) => s + db.itens.filter(i => aguardaMeu(u, t, i)).length, 0);
const reunioesDe = u => { const ids = visiveis(u).map(t => t.id); return db.reunioes.filter(r => ids.includes(r.tid)); };
const paraAceitar = u => reunioesDe(u).filter(r => r.status === 'pendente').sort((a, b) => a.data.localeCompare(b.data));

/* Partes reutilizadas */
const status = s => `<span class="st ${s.cor}">${esc(s.txt)}</span>`;
const cabeca = (titulo, sub, acao) => `<div class="cabeca"><div><h1>${esc(titulo)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</div>${acao || ''}</div>`;
const barra = (feitos, total) => `<div class="barra" aria-hidden="true"><i style="width:${total ? Math.round(feitos / total * 100) : 0}%"></i></div>`;

/* Início */
function vInicio() { return eu().papel === 'aluno' ? inicioAluno() : inicioOrientador(); }

function inicioAluno() {
  const me = eu(), t = doAluno(me.id), lista = itens();
  const prox = lista.find(i => !enviosDe(t.id, i.id).length);
  const feitas = enviadas(t), fb = feedbacksDe(t.id)[0];
  const reu = db.reunioes.filter(r => r.tid === t.id && r.status === 'aceita' && diasAte(r.data) >= 0).sort((a, b) => a.data.localeCompare(b.data))[0];
  const orient = t.orientadorId ? `Orientação: ${nomeDe(t.orientadorId)}` : 'Orientação a definir pela coordenação';
  return cabeca(`Olá, ${me.nome.split(' ')[0]}`, t.tema) + `<div class="grade">
    <section class="card"><p class="rot">Próximo prazo</p>${prox
      ? `<p class="grande">${esc(prox.titulo)}</p><p class="sub">${dia(prox.prazo)}, ${quando(prox.prazo)}</p><a class="btn" href="#/entregas/${t.id}/${prox.id}">Enviar entrega</a>`
      : '<p class="grande">Tudo entregue</p>'}</section>
    <section class="card"><p class="rot">Andamento</p><p class="grande">${feitas} de ${lista.length} entregas</p>${barra(feitas, lista.length)}<p class="sub">${esc(orient)}</p></section>
    <section class="card"><p class="rot">Último feedback</p>${fb
      ? `<p>${esc(fb.texto)}</p><p class="sub">${esc(nomeDe(fb.autorId))}, ${esc(item(fb.iid).titulo)}</p><a class="vermais" href="#/entregas/${t.id}/${fb.iid}">Abrir entrega</a>`
      : '<p class="sub">Nenhum feedback ainda.</p>'}</section>
    <section class="card"><p class="rot">Próxima reunião</p>${reu
      ? `<p class="grande">${dia(reu.data)}, ${esc(reu.hora)}</p><p class="sub">${esc(reu.assunto)}</p>`
      : '<p class="sub">Nenhuma reunião marcada.</p>'}<a class="vermais" href="#/agenda">Abrir agenda</a></section>
  </div>`;
}

function inicioOrientador() {
  const me = eu(), meus = visiveis(me), total = db.itens.length;
  const rows = meus.map(t => {
    const espera = db.itens.filter(i => aguardaMeu(me, t, i)).length;
    return `<a class="linha c-orientandos" href="#/entregas/${t.id}">
      <div class="t">${esc(alunoDe(t).nome)}<small>${esc(t.tema)}</small></div>
      <div class="mini">${barra(enviadas(t), total)}<span>${enviadas(t)}/${total}</span></div>
      <div>${status(espera ? { txt: espera === 1 ? '1 sem feedback' : `${espera} sem feedback`, cor: 'ambar' } : { txt: 'Em dia', cor: 'verde' })}</div></a>`;
  }).join('');
  return cabeca(`Olá, ${me.nome.split(' ')[0]}`) + `<div class="numeros">
    <a href="#/entregas"><strong>${qtdAguardando(me)}</strong><span>Entregas sem feedback</span></a>
    <a href="#/agenda"><strong>${paraAceitar(me).length}</strong><span>Reuniões para aceitar</span></a>
    <a href="#/chat"><strong>${qtdNaoLidas(me)}</strong><span>Mensagens novas</span></a>
  </div><h2 class="titulo-sec">Orientandos</h2>
  <div class="lista"><div class="cab c-orientandos"><div>Aluno</div><div>Andamento</div><div>Situação</div></div>${rows || '<p class="vazio">Nenhum orientando ainda.</p>'}</div>`;
}

/* Entregas */
function vEntregas(r) {
  const me = eu();
  if (r[1] && r[2]) return detalheEntrega(r[1], r[2]);
  return me.papel === 'aluno' ? entregasAluno() : entregasRevisao(r[1]);
}

function entregasAluno() {
  const t = doAluno(eu().id);
  const rows = itens().map(i => {
    const fb = feedbacksDe(t.id, i.id)[0];
    return `<a class="linha c-entregas" href="#/entregas/${t.id}/${i.id}">
      <div class="t">${esc(i.titulo)}<small>Prazo ${dia(i.prazo)}</small></div>
      <div>${status(situacao(t, i))}</div>
      <div data-r="Nota"${media(t.id, i.id) === null ? ' class="sem-nota"' : ''}>${nota(media(t.id, i.id))}</div>
      <div class="corta">${fb ? esc(fb.texto) : ''}</div></a>`;
  }).join('');
  return cabeca('Entregas') + `<div class="lista"><div class="cab c-entregas"><div>Entrega</div><div>Situação</div><div>Nota</div><div>Feedback</div></div>${rows}</div>`;
}

function entregasRevisao(filtro) {
  const me = eu(), meus = visiveis(me);
  if (!meus.length) return cabeca('Entregas') + '<div class="lista"><p class="vazio">Nenhum trabalho liberado pela coordenação ainda.</p></div>';
  const alvo = meus.find(t => t.id === filtro);
  const abas = `<nav class="abas" aria-label="Filtrar por aluno"><a href="#/entregas" aria-current="${!alvo}">Todos</a>${meus.map(t => `<a href="#/entregas/${t.id}" aria-current="${!!alvo && alvo.id === t.id}">${esc(alunoDe(t).nome)}</a>`).join('')}</nav>`;
  let pares = [];
  (alvo ? [alvo] : meus).forEach(t => itens().forEach(i => { if (alvo || enviosDe(t.id, i.id).length) pares.push({ t, i }); }));
  if (!alvo) pares.sort((a, b) => (aguardaMeu(me, b.t, b.i) - aguardaMeu(me, a.t, a.i)) || (enviosDe(b.t.id, b.i.id)[0].data - enviosDe(a.t.id, a.i.id)[0].data));
  const rows = pares.map(({ t, i }) => {
    const env = enviosDe(t.id, i.id)[0];
    const s = !env ? { txt: 'Não enviada', cor: 'cinza' } : aguardaMeu(me, t, i) ? { txt: 'Aguardando feedback', cor: 'ambar' } : { txt: 'Com feedback', cor: 'verde' };
    return `<a class="linha c-revisao" href="#/entregas/${t.id}/${i.id}">
      <div class="t">${esc(i.titulo)}<small>${esc(alunoDe(t).nome)}</small></div>
      <div data-r="Enviada">${env ? diaDe(env.data) : '–'}</div>
      <div>${status(s)}</div>
      <div data-r="Nota"${media(t.id, i.id) === null ? ' class="sem-nota"' : ''}>${nota(media(t.id, i.id))}</div></a>`;
  }).join('');
  return cabeca('Entregas') + abas + `<div class="lista"><div class="cab c-revisao"><div>Entrega</div><div>Enviada</div><div>Situação</div><div>Nota</div></div>${rows || '<p class="vazio">Nenhuma entrega enviada ainda.</p>'}</div>`;
}

function detalheEntrega(tid, iid) {
  const me = eu(), t = visiveis(me).find(x => x.id === tid), i = item(iid);
  if (!t || !i) return cabeca('Entrega não encontrada') + '<a href="#/entregas">Voltar para Entregas</a>';
  const aluno = me.papel === 'aluno', envs = enviosDe(tid, iid), fbs = feedbacksDe(tid, iid);
  const versoes = envs.map((e, n) => `<div class="versao"><div><strong>${esc(e.nome)}</strong><span>Versão ${envs.length - n}, ${diaDe(e.data)}, ${tamanho(e.tam)}</span></div><button class="btn sec peq" data-acao="baixar" data-id="${e.id}" data-nome="${esc(e.nome)}">Baixar</button></div>`).join('');
  const envio = aluno ? `<label class="envio" data-envio="${tid}/${iid}">${ic('subir', 22)}<strong>${envs.length ? 'Enviar nova versão' : 'Escolher arquivo'}</strong><span>PDF, DOCX ou ZIP, até 25 MB</span><input type="file" accept=".pdf,.docx,.zip" data-arquivo="${tid}/${iid}" aria-label="Arquivo da entrega"></label>` : '';
  const lista = fbs.map(f => {
    const a = pessoa(f.autorId);
    return `<article class="fb"><div class="fb-topo"><strong>${esc(a.nome)}</strong><span>${PAPEL[a.papel]}, ${diaDe(f.data)}</span>${f.nota !== null && f.nota !== undefined ? `<b>${nota(f.nota)}</b>` : ''}</div><p>${esc(f.texto)}</p></article>`;
  }).join('');
  const form = !aluno ? `<form class="form-fb" data-form="feedback" data-t="${tid}" data-i="${iid}">
      <label class="campo">Novo feedback<textarea name="texto" required placeholder="Escreva o feedback"></textarea></label>
      <div class="fim"><label class="campo">Nota<input name="nota" type="number" min="0" max="10" step="0.1" inputmode="decimal"></label><button class="btn">Enviar feedback</button></div></form>` : '';
  const sub = `${i.fase}, prazo ${dia(i.prazo)}. ${i.descricao}`;
  const voltar = aluno ? '#/entregas' : `#/entregas/${tid}`;
  return `<a class="voltar" href="${voltar}">${ic('esquerda', 16)}${aluno ? 'Entregas' : esc(alunoDe(t).nome)}</a>` + cabeca(i.titulo, sub, `<div>${status(situacao(t, i))}</div>`) + `
    <div class="det">
      <section class="card"><h2>Arquivo</h2>${versoes || (aluno ? '' : '<p class="sub">O aluno ainda não enviou.</p>')}${envio}</section>
      <section class="card"><h2>Feedback</h2>${lista || '<p class="sub">Nenhum feedback ainda.</p>'}${form}</section>
    </div>`;
}

/* Agenda */
function eventos() {
  const me = eu(), aluno = me.papel === 'aluno', out = {};
  const por = (d, e) => { (out[d] = out[d] || []).push(e); };
  db.itens.forEach(i => por(i.prazo, { tipo: 'prazo', txt: i.titulo }));
  reunioesDe(me).filter(r => r.status !== 'recusada').forEach(r => por(r.data, {
    tipo: r.status === 'aceita' ? 'reuniao' : 'pendente',
    txt: `${r.hora} ${aluno ? 'Reunião' : alunoDe(trabalho(r.tid)).nome.split(' ')[0]}`
  }));
  return out;
}

function vAgenda() {
  const me = eu(), aluno = me.papel === 'aluno', t = aluno ? doAluno(me.id) : null;
  const ano = estado.mes.getFullYear(), mes = estado.mes.getMonth();
  const vazios = (new Date(ano, mes, 1).getDay() + 6) % 7, total = new Date(ano, mes + 1, 0).getDate();
  const evs = eventos(), hojeIso = paraIso(new Date());
  const pode = aluno && t && t.orientadorId;
  let cel = '<div class="dia fora"></div>'.repeat(vazios);
  for (let d = 1; d <= total; d++) {
    const data = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dentro = `<b>${d}</b>${(evs[data] || []).map(e => `<span class="ev ${e.tipo}" title="${esc(e.txt)}">${esc(e.txt)}</span>`).join('')}`;
    const cls = `dia${data === hojeIso ? ' hoje' : ''}`;
    cel += pode && data >= hojeIso ? `<button class="${cls}" data-acao="pedirReuniao" data-data="${data}" aria-label="Solicitar reunião no dia ${d}">${dentro}</button>` : `<div class="${cls}">${dentro}</div>`;
  }
  cel += '<div class="dia fora"></div>'.repeat((7 - (vazios + total) % 7) % 7);

  const reu = r => {
    const quem = aluno ? '' : `${alunoDe(trabalho(r.tid)).nome}, `;
    const st = { aceita: { txt: 'Aceita', cor: 'verde' }, pendente: { txt: 'Aguardando', cor: 'ambar' }, recusada: { txt: 'Recusada', cor: 'vermelho' } }[r.status];
    const acoes = !aluno && r.status === 'pendente' ? `<div class="acoes"><button class="btn peq" data-acao="responderReuniao" data-id="${r.id}" data-status="aceita">Aceitar</button><button class="btn sec peq" data-acao="responderReuniao" data-id="${r.id}" data-status="recusada">Recusar</button></div>` : status(st);
    return `<div class="reu"><strong>${esc(quem)}${dia(r.data)}, ${esc(r.hora)}</strong><p>${esc(r.assunto)}</p>${acoes}</div>`;
  };
  const futuras = reunioesDe(me).filter(r => diasAte(r.data) >= 0).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  const prazos = itens().filter(i => diasAte(i.prazo) >= 0).slice(0, 3).map(i => `<div class="prazo-lado">${esc(i.titulo)}<span>${dia(i.prazo)}</span></div>`).join('');
  const lado = aluno
    ? `<section class="card"><h2>Reuniões</h2>${futuras.map(reu).join('') || '<p class="vazio">Nenhuma solicitação.</p>'}</section>
       <section class="card"><h2>Próximos prazos</h2>${prazos || '<p class="vazio">Nenhum prazo em aberto.</p>'}</section>`
    : `<section class="card"><h2>Para aceitar</h2>${paraAceitar(me).map(reu).join('') || '<p class="vazio">Nenhum pedido novo.</p>'}</section>
       <section class="card"><h2>Próximas reuniões</h2>${futuras.filter(r => r.status === 'aceita').map(reu).join('') || '<p class="vazio">Nenhuma reunião marcada.</p>'}</section>`;
  const acao = aluno ? `<button class="btn" data-acao="pedirReuniao" ${pode ? '' : 'disabled'}>${ic('mais', 16)}Solicitar reunião</button>` : '';
  return cabeca('Agenda', aluno && !pode ? 'A reunião abre quando a coordenação definir a orientação.' : '', acao) + `<div class="agenda">
    <section class="card">
      <div class="mes"><strong>${MESES[mes][0].toUpperCase() + MESES[mes].slice(1)} ${ano}</strong>
        <button class="seta" data-acao="mudarMes" data-n="-1" aria-label="Mês anterior">${ic('esquerda', 16)}</button>
        <button class="seta" data-acao="mudarMes" data-n="1" aria-label="Próximo mês">${ic('direita', 16)}</button></div>
      <div class="cal">${['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(d => `<div class="sem">${d}</div>`).join('')}${cel}</div>
      <div class="legenda"><span><i style="background:#F2C77E"></i>Prazo</span><span><i style="background:#1456B8"></i>Reunião</span><span><i style="box-shadow:inset 0 0 0 1.5px #1456B8"></i>Aguardando resposta</span></div>
    </section>
    <div class="lado">${lado}</div>
  </div>`;
}

/* Coordenação */
function vAlunos() {
  const total = db.itens.length;
  const lista = db.trabalhos.slice().sort((a, b) => (a.orientadorId ? 1 : 0) - (b.orientadorId ? 1 : 0) || alunoDe(a).nome.localeCompare(alunoDe(b).nome));
  const rows = lista.map(t => `<button class="linha c-alunos" data-acao="editarAluno" data-id="${t.id}">
    <div class="t">${esc(alunoDe(t).nome)}<small>${esc(t.tema)}</small></div>
    <div data-r="Orientação:">${t.orientadorId ? esc(nomeDe(t.orientadorId)) : status({ txt: 'A definir', cor: 'ambar' })}</div>
    <div data-r="Banca:">${t.bancaIds.length ? esc(t.bancaIds.map(nomeDe).join(', ')) : '<span class="st cinza">Sem acesso</span>'}</div>
    <div class="mini">${barra(enviadas(t), total)}<span>${enviadas(t)}/${total}</span></div></button>`).join('');
  const faltam = db.trabalhos.filter(t => !t.orientadorId).length;
  return cabeca('Alunos', faltam ? (faltam === 1 ? '1 aluno sem orientação' : `${faltam} alunos sem orientação`) : '') +
    `<div class="lista"><div class="cab c-alunos"><div>Aluno</div><div>Orientação</div><div>Banca</div><div>Andamento</div></div>${rows}</div>`;
}

function vPrazos() {
  const total = db.trabalhos.length;
  const rows = itens().map(i => {
    const n = db.trabalhos.filter(t => enviosDe(t.id, i.id).length).length;
    return `<div class="linha c-prazos"><div class="t">${esc(i.titulo)}<small>${esc(i.fase)}</small></div>
      <input type="date" value="${i.prazo}" data-prazo="${i.id}" aria-label="Prazo de ${esc(i.titulo)}">
      <div class="corta">${n} de ${total} enviaram</div>
      <button class="link" data-acao="editarItem" data-id="${i.id}">Editar</button></div>`;
  }).join('');
  return cabeca('Prazos', 'Valem para todos os alunos.', `<button class="btn" data-acao="novoItem">${ic('mais', 16)}Nova entrega</button>`) +
    `<div class="lista"><div class="cab c-prazos"><div>Entrega</div><div>Prazo</div><div>Envios</div><div></div></div>${rows || '<p class="vazio">Nenhuma entrega definida.</p>'}</div>`;
}

/* Telas */
const TELAS = { inicio: vInicio, entregas: vEntregas, agenda: vAgenda, chat: r => vChat(r), biblioteca: r => vBiblioteca(r), alunos: vAlunos, prazos: vPrazos };

function telaLogin() {
  return `<main class="login">
    <div class="login-marca"><strong>Central do TCC</strong><span>Protótipo acadêmico</span></div>
    <form class="login-card" data-form="login" novalidate>
      <label class="campo">Login<input name="login" id="f-login" autocomplete="username" required></label>
      <label class="campo">Senha<span class="senha"><input name="senha" id="f-senha" type="password" autocomplete="current-password" required><button type="button" data-acao="verSenha" aria-label="Mostrar senha">${ic('olho')}</button></span></label>
      <p class="erro" id="erro" hidden></p>
      <button class="btn">Entrar</button>
      <button type="button" class="link" data-acao="esqueci">Esqueci minha senha</button>
      <p class="nota-senha" id="nota-senha" hidden>No esboço, todas as contas usam a senha 1234.</p>
    </form>
    <div class="demo"><p>Protótipo com dados fictícios. Não use senha real.</p><p>Contas de teste</p><div>${['aluno', 'orientador', 'coordenador', 'banca'].map(l => `<button type="button" data-acao="preencher" data-login="${l}">${l[0].toUpperCase() + l.slice(1)}</button>`).join('')}</div>
    <button type="button" class="link" data-acao="restaurar">Restaurar dados de exemplo</button></div>
  </main>`;
}

function badge(chave, me) {
  const n = chave === 'chat' ? qtdNaoLidas(me) : chave === 'agenda' && me.papel === 'orientador' ? paraAceitar(me).length : chave === 'entregas' && me.papel !== 'aluno' ? qtdAguardando(me) : 0;
  return n ? `<span class="qtd" aria-label="${n} pendente${n > 1 ? 's' : ''}">${n}</span>` : '';
}

function render() {
  const app = document.getElementById('app'), me = eu();
  if (!me) { document.title = 'Central do TCC'; app.innerHTML = telaLogin(); return; }
  const nav = NAV[me.papel];
  let r = location.hash.replace(/^#\/?/, '').split('/');
  if (!nav.some(n => n[0] === r[0])) { r = [nav[0][0]]; history.replaceState(null, '', `#/${r[0]}`); }
  const corpo = TELAS[r[0]](r);
  document.title = `${nav.find(n => n[0] === r[0])[1]} · Central do TCC`;
  app.innerHTML = `<div class="shell">
    <aside class="lateral"><div class="marca">Central do TCC<span>Protótipo acadêmico</span></div>
      <nav class="nav" aria-label="Principal">${nav.map(n => `<a href="#/${n[0]}" ${n[0] === r[0] ? 'aria-current="page"' : ''}>${ic(n[2], 19)}<span>${n[1]}</span>${badge(n[0], me)}</a>`).join('')}</nav>
      <div class="quem"><div><strong>${esc(me.nome)}</strong><span>${PAPEL[me.papel]}</span></div><button class="sair" data-acao="sair" aria-label="Sair" title="Sair">${ic('sair')}</button></div>
    </aside>
    <div><div class="topo"><strong>Central do TCC</strong><div>${PAPEL[me.papel]}<button class="sair" data-acao="sair" aria-label="Sair">${ic('sair')}</button></div></div>
    <main class="corpo">${corpo}</main></div></div>`;
  const m = document.getElementById('msgs');
  if (m) m.scrollTop = m.scrollHeight;
}

/* Modal e aviso */
const modal = document.getElementById('modal');
function abrirModal(titulo, corpo, largo) {
  modal.classList.toggle('largo', !!largo);
  modal.innerHTML = `<div class="m-topo"><h2 id="modal-titulo">${esc(titulo)}</h2><button class="sair" data-acao="fecharModal" aria-label="Fechar">${ic('fechar')}</button></div><div class="m-corpo">${corpo}</div>`;
  modal.showModal();
}
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
let tempoAviso;
function aviso(txt) {
  const a = document.getElementById('aviso');
  a.textContent = txt; a.classList.add('on');
  clearTimeout(tempoAviso); tempoAviso = setTimeout(() => a.classList.remove('on'), 2600);
}

/* Ações */
const acoes = {
  preencher(b) {
    document.getElementById('f-login').value = b.dataset.login;
    document.getElementById('f-senha').value = SENHA;
    document.getElementById('erro').hidden = true;
  },
  verSenha(b) {
    const i = document.getElementById('f-senha'), ver = i.type === 'password';
    i.type = ver ? 'text' : 'password';
    b.setAttribute('aria-label', ver ? 'Esconder senha' : 'Mostrar senha');
  },
  esqueci() { document.getElementById('nota-senha').hidden = false; },
  restaurar() { db = exemplo(); salvar(); aviso('Dados de exemplo restaurados.'); },
  sair() { limparChat(); limparBib(); sessao(null); history.replaceState(null, '', location.pathname); render(); },
  fecharModal() { modal.close(); },
  baixar(b) {
    arquivos.ler(b.dataset.id).then(blob => {
      if (blob) return salvarArquivo(blob, b.dataset.nome);
      salvarArquivo(pdfSimples([{ t: b.dataset.nome, s: 16, b: true, m: 12 }, { t: 'Arquivo de exemplo do esboço da Central do TCC.', s: 12 }]), b.dataset.nome.replace(/\.\w+$/, '.pdf'));
    });
  },
  mudarMes(b) { estado.mes = new Date(estado.mes.getFullYear(), estado.mes.getMonth() + Number(b.dataset.n), 1); render(); },
  pedirReuniao(b) {
    const min = paraIso(new Date());
    abrirModal('Solicitar reunião', `<form class="m-corpo" style="padding:0" data-form="reuniao">
      <div class="duas"><label class="campo">Data<input type="date" name="data" min="${min}" value="${b.dataset.data || ''}" required></label>
      <label class="campo">Horário<input type="time" name="hora" required></label></div>
      <label class="campo">Assunto<input name="assunto" required></label>
      <div class="m-fim"><button type="button" class="btn sec" data-acao="fecharModal">Cancelar</button><button class="btn">Solicitar</button></div></form>`);
  },
  responderReuniao(b) {
    db.reunioes.find(r => r.id === b.dataset.id).status = b.dataset.status;
    salvar(); render(); aviso(b.dataset.status === 'aceita' ? 'Reunião aceita.' : 'Reunião recusada.');
  },
  editarAluno(b) {
    const t = trabalho(b.dataset.id);
    const orient = db.usuarios.filter(u => u.papel === 'orientador');
    const banca = db.usuarios.filter(u => u.papel === 'banca');
    abrirModal(alunoDe(t).nome, `<form class="m-corpo" style="padding:0" data-form="aluno" data-t="${t.id}">
      <p class="ajuda">${esc(t.tema)}</p>
      <label class="campo">Orientação<select name="orientador"><option value="">A definir</option>${orient.map(o => `<option value="${o.id}" ${o.id === t.orientadorId ? 'selected' : ''}>${esc(o.nome)}</option>`).join('')}</select></label>
      <fieldset><legend>Acesso da banca</legend>${banca.map(p => `<label class="check"><input type="checkbox" name="banca" value="${p.id}" ${t.bancaIds.includes(p.id) ? 'checked' : ''}>${esc(p.nome)}</label>`).join('')}</fieldset>
      <div class="m-fim"><button type="button" class="btn sec" data-acao="fecharModal">Cancelar</button><button class="btn">Salvar</button></div></form>`);
  },
  novoItem() { formItem(null); },
  editarItem(b) { formItem(item(b.dataset.id)); },
  removerItem(b) {
    if (!b.dataset.ok) { b.dataset.ok = '1'; b.textContent = 'Confirmar remoção'; return; }
    const id = b.dataset.id;
    db.itens = db.itens.filter(i => i.id !== id);
    db.envios = db.envios.filter(e => e.iid !== id);
    db.feedbacks = db.feedbacks.filter(f => f.iid !== id);
    salvar(); modal.close(); render(); aviso('Entrega removida.');
  }
};

function formItem(i) {
  abrirModal(i ? 'Editar entrega' : 'Nova entrega', `<form class="m-corpo" style="padding:0" data-form="item" data-id="${i ? i.id : ''}">
    <label class="campo">Nome<input name="titulo" value="${i ? esc(i.titulo) : ''}" required></label>
    <div class="duas"><label class="campo">Fase<select name="fase"><option ${i && i.fase === 'TC1' ? 'selected' : ''}>TC1</option><option ${!i || i.fase === 'TC2' ? 'selected' : ''}>TC2</option></select></label>
    <label class="campo">Prazo<input type="date" name="prazo" value="${i ? i.prazo : ''}" required></label></div>
    <label class="campo">O que entregar<input name="descricao" value="${i ? esc(i.descricao) : ''}"></label>
    <div class="m-fim">${i ? `<button type="button" class="btn perigo" data-acao="removerItem" data-id="${i.id}">Remover</button>` : ''}<button type="button" class="btn sec" data-acao="fecharModal">Cancelar</button><button class="btn">Salvar</button></div></form>`);
}

/* Formulários */
const forms = {
  login(f, d) {
    const login = String(d.get('login')).trim().toLowerCase();
    const u = db.usuarios.find(x => x.login === login);
    if (!u || d.get('senha') !== SENHA) {
      const e = document.getElementById('erro');
      e.textContent = 'Login ou senha incorretos.'; e.hidden = false;
      return;
    }
    sessao(u.id);
    location.hash = `#/${NAV[u.papel][0][0]}`;
    render();
  },
  feedback(f, d) {
    const n = d.get('nota');
    db.feedbacks.push({ id: novoId(), tid: f.dataset.t, iid: f.dataset.i, autorId: eu().id, nota: n === '' ? null : Number(n), texto: String(d.get('texto')).trim(), data: Date.now() });
    salvar(); render(); aviso('Feedback enviado.');
  },
  reuniao(f, d) {
    const t = doAluno(eu().id);
    db.reunioes.push({ id: novoId(), tid: t.id, data: d.get('data'), hora: d.get('hora'), assunto: String(d.get('assunto')).trim(), status: 'pendente' });
    salvar(); modal.close(); render(); aviso('Pedido enviado para a orientação.');
  },
  aluno(f, d) {
    const t = trabalho(f.dataset.t);
    t.orientadorId = d.get('orientador') || null;
    t.bancaIds = d.getAll('banca');
    salvar(); modal.close(); render(); aviso('Aluno atualizado.');
  },
  item(f, d) {
    const dados = { titulo: String(d.get('titulo')).trim(), fase: d.get('fase'), prazo: d.get('prazo'), descricao: String(d.get('descricao')).trim() };
    const i = item(f.dataset.id);
    if (i) Object.assign(i, dados); else db.itens.push(Object.assign({ id: novoId() }, dados));
    salvar(); modal.close(); render(); aviso(i ? 'Entrega atualizada.' : 'Entrega criada para todos os alunos.');
  }
};

function receberArquivo(file, alvo) {
  if (!file) return;
  const [tid, iid] = alvo.split('/');
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['pdf', 'docx', 'zip'].includes(ext)) return aviso('Use um arquivo PDF, DOCX ou ZIP.');
  if (file.size > 25 * 1048576) return aviso('O arquivo passa de 25 MB.');
  const id = novoId();
  arquivos.guardar(id, file).then(() => {
    db.envios.push({ id, tid, iid, nome: file.name, tam: file.size, data: Date.now() });
    salvar(); render(); aviso('Entrega enviada.');
  });
}

/* Eventos */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-acao]');
  if (b && acoes[b.dataset.acao]) acoes[b.dataset.acao](b);
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-form]');
  if (!f) return;
  e.preventDefault();
  forms[f.dataset.form](f, new FormData(f));
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.arquivo) receberArquivo(el.files[0], el.dataset.arquivo);
  if (el.dataset.prazo && el.value) {
    item(el.dataset.prazo).prazo = el.value;
    salvar(); render(); aviso('Prazo atualizado.');
  }
});
['dragover', 'dragleave', 'drop'].forEach(tipo => document.addEventListener(tipo, e => {
  const z = e.target.closest && e.target.closest('[data-envio]');
  if (!z) return;
  e.preventDefault();
  z.classList.toggle('sobre', tipo === 'dragover');
  if (tipo === 'drop') receberArquivo(e.dataTransfer.files[0], z.dataset.envio);
}));
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
/* Com o site aberto em duas abas, uma como aluno e outra como orientador, a outra aba acompanha as mudanças. */
window.addEventListener('storage', e => {
  if (e.key !== CHAVE) return;
  const foco = document.activeElement, rascunho = document.getElementById('msg');
  const digitando = foco && /INPUT|TEXTAREA|SELECT/.test(foco.tagName) && foco !== rascunho;
  db = ler();
  if (modal.open || digitando || !eu()) return;
  const texto = rascunho ? rascunho.value : '', tinhaFoco = foco === rascunho;
  render();
  const novo = document.getElementById('msg');
  if (novo) { novo.value = texto; if (tinhaFoco) novo.focus(); }
});
