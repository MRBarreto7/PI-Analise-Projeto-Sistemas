'use strict';
/* Bate-papo: conversa direta entre quaisquer duas pessoas do sistema. */

const chat = { busca: '', papel: '', aba: 'todas', dentro: '', buscandoDentro: false };
const FILTROS_PAPEL = [['', 'Todos'], ['aluno', 'Alunos'], ['orientador', 'Orientação'], ['coordenador', 'Coordenação'], ['banca', 'Banca']];

const minhasConversas = u => db.conversas.filter(c => c.participantes.includes(u.id));
const outroDe = (c, u) => pessoa(c.participantes.find(p => p !== u.id));
const conversaCom = (a, b) => db.conversas.find(c => c.participantes.includes(a) && c.participantes.includes(b));
const msgsDe = cid => db.mensagens.filter(m => m.cid === cid).sort((a, b) => a.data - b.data);
const ultimaDe = cid => msgsDe(cid).slice(-1)[0];
const lidoEm = (uid, cid) => db.leitura[`${uid}:${cid}`] || 0;
const naoLidasEm = (u, c) => db.mensagens.filter(m => m.cid === c.id && m.autorId !== u.id && m.data > lidoEm(u.id, c.id)).length;
const qtdNaoLidas = u => minhasConversas(u).reduce((s, c) => s + naoLidasEm(u, c), 0);
const textoMsg = m => m.anexo ? `Arquivo: ${m.anexo.nome}` : m.texto;
const descricao = p => `${PAPEL[p.papel]}, ${p.curso}`;
const iniciais = nome => { const p = nome.split(' '); return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); };
const avatar = p => `<span class="av" aria-hidden="true">${esc(iniciais(p.nome))}</span>`;

/* A busca é de quem está logado: quem entra depois começa do zero. */
function limparChat() { Object.assign(chat, { busca: '', papel: '', aba: 'todas', dentro: '', buscandoDentro: false, rota: '' }); }

function hora(ms) {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function diaCurto(ms) {
  const n = diasAte(paraIso(new Date(ms)));
  return n === 0 ? hora(ms) : n === -1 ? 'ontem' : diaDe(ms);
}
function separador(ms) {
  const n = diasAte(paraIso(new Date(ms)));
  if (n === 0) return 'Hoje';
  if (n === -1) return 'Ontem';
  const d = new Date(ms);
  return `${d.getDate()} de ${MESES[d.getMonth()]}`;
}

function linhaConversa(c, atual) {
  const me = eu(), o = outroDe(c, me), ult = ultimaDe(c.id);
  const n = atual && atual.id === c.id ? 0 : naoLidasEm(me, c);
  return `<a class="contato" href="#/chat/${c.id}" aria-current="${!!atual && atual.id === c.id}">${avatar(o)}
    <div><strong><span>${marcar(o.nome, chat.busca)}</span>${ult ? `<time>${diaCurto(ult.data)}</time>` : ''}</strong>
    <small>${ult ? `${ult.autorId === me.id ? 'Você: ' : ''}${esc(textoMsg(ult))}` : esc(descricao(o))}</small></div>${n ? `<span class="qtd">${n}</span>` : ''}</a>`;
}

function listaChat(atual) {
  const me = eu();
  const conversas = minhasConversas(me).sort((a, b) => ((ultimaDe(b.id) || {}).data || 0) - ((ultimaDe(a.id) || {}).data || 0));
  const q = norm(chat.busca).trim();
  if (!q && !chat.papel) {
    const lista = chat.aba === 'naolidas' ? conversas.filter(c => naoLidasEm(me, c)) : conversas;
    return lista.map(c => linhaConversa(c, atual)).join('') || `<p class="chat-vazio">${chat.aba === 'naolidas' ? 'Nenhuma conversa não lida.' : 'Busque uma pessoa para começar.'}</p>`;
  }
  const bate = p => (!chat.papel || p.papel === chat.papel) && (!q || norm(`${p.nome} ${p.curso} ${PAPEL[p.papel]}`).includes(q));
  const comConversa = conversas.filter(c => bate(outroDe(c, me)));
  const ids = comConversa.map(c => outroDe(c, me).id);
  const pessoas = db.usuarios.filter(p => p.id !== me.id && !ids.includes(p.id) && bate(p)).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  const rowPessoa = p => `<a class="contato" href="#/chat/p/${p.id}">${avatar(p)}<div><strong><span>${marcar(p.nome, chat.busca)}</span></strong><small>${esc(descricao(p))}</small></div></a>`;
  if (!comConversa.length && !pessoas.length) return '<p class="chat-vazio">Ninguém encontrado com esse nome.</p>';
  return (comConversa.length ? `<p class="chat-grupo">Conversas</p>${comConversa.map(c => linhaConversa(c, atual)).join('')}` : '')
    + (pessoas.length ? `<p class="chat-grupo">Pessoas</p>${pessoas.map(rowPessoa).join('')}` : '');
}

function filtrosChat() {
  const buscando = chat.busca.trim() || chat.papel;
  return buscando
    ? FILTROS_PAPEL.map(([v, n]) => `<button type="button" data-acao="chatPapel" data-v="${v}" aria-pressed="${chat.papel === v}">${n}</button>`).join('')
    : [['todas', 'Todas'], ['naolidas', 'Não lidas']].map(([v, n]) => `<button type="button" data-acao="chatAba" data-v="${v}" aria-pressed="${chat.aba === v}">${n}</button>`).join('');
}

function bolhas(cid, alvo) {
  const me = eu(), msgs = msgsDe(cid), q = chat.dentro;
  const lista = q.trim() ? msgs.filter(m => norm(textoMsg(m)).includes(norm(q).trim())) : msgs;
  if (!lista.length) return `<p class="chat-vazio">${q.trim() ? 'Nenhuma mensagem encontrada.' : ''}</p>`;
  const minhas = msgs.filter(m => m.autorId === me.id), ultimaMinha = minhas[minhas.length - 1];
  const visto = ultimaMinha && alvo && lidoEm(alvo.id, cid) >= ultimaMinha.data;
  let dia_ = '';
  return lista.map(m => {
    const sep = separador(m.data), mostra = sep !== dia_;
    dia_ = sep;
    const corpo = m.anexo
      ? `<button class="anexo" data-acao="baixar" data-id="${esc(m.anexo.id)}" data-nome="${esc(m.anexo.nome)}">${ic('arquivo', 20)}<span><strong>${esc(m.anexo.nome)}</strong><small>${tamanho(m.anexo.tam)}</small></span></button>`
      : `<p>${marcar(m.texto, q)}</p>`;
    return `${mostra ? `<p class="dia-msg"><span>${sep}</span></p>` : ''}<div class="msg${m.autorId === me.id ? ' minha' : ''}">${corpo}<span>${hora(m.data)}${visto && m === ultimaMinha ? ', visto' : ''}</span></div>`;
  }).join('');
}

function painelConversa(alvo, c) {
  const me = eu();
  /* Só grava quando há novidade: gravar a cada desenho faria duas abas abertas se redesenharem sem parar. */
  if (c && naoLidasEm(me, c)) { db.leitura[`${me.id}:${c.id}`] = Date.now(); salvar(); }
  const inicio = `<p class="chat-vazio">Escreva a primeira mensagem para ${esc(alvo.nome.split(' ')[0])}.</p>`;
  return `<section class="conversa" aria-label="Conversa com ${esc(alvo.nome)}">
    <header><a class="seta chat-voltar" href="#/chat" aria-label="Voltar para as conversas">${ic('esquerda', 16)}</a>${avatar(alvo)}
      <button class="conv-quem" data-acao="verPessoa" data-id="${alvo.id}"><strong>${esc(alvo.nome)}</strong><span>${esc(descricao(alvo))}</span></button>
      ${c ? `<button class="seta" data-acao="chatBuscarDentro" aria-label="Buscar nesta conversa">${ic('busca', 16)}</button>` : ''}</header>
    ${chat.buscandoDentro && c ? `<div class="busca-dentro"><input data-chat-dentro="${c.id}" data-alvo="${alvo.id}" value="${esc(chat.dentro)}" placeholder="Buscar nesta conversa" aria-label="Buscar nesta conversa"></div>` : ''}
    <div class="msgs" id="msgs">${c ? bolhas(c.id, alvo) : inicio}</div>
    <form class="escrever" data-form="mensagem" data-para="${alvo.id}">
      <label class="clipe" title="Enviar arquivo">${ic('clipe', 19)}<input type="file" data-anexo="${alvo.id}" aria-label="Enviar arquivo"></label>
      <input id="msg" name="texto" placeholder="Escreva uma mensagem" autocomplete="off" aria-label="Mensagem" required><button class="btn">Enviar</button></form></section>`;
}

function vChat(r) {
  const me = eu(), movel = window.matchMedia('(max-width:760px)').matches, rota = r.slice(1).join('/');
  if (chat.rota !== rota) { chat.rota = rota; chat.dentro = ''; chat.buscandoDentro = false; }
  let c = null, alvo = null;
  if (r[1] === 'p') {
    alvo = pessoa(r[2]);
    c = alvo ? conversaCom(me.id, alvo.id) : null;
    if (alvo && alvo.id === me.id) alvo = null;
  } else if (r[1]) {
    c = minhasConversas(me).find(x => x.id === r[1]) || null;
  }
  if (!c && !alvo && !movel) c = minhasConversas(me).sort((a, b) => ((ultimaDe(b.id) || {}).data || 0) - ((ultimaDe(a.id) || {}).data || 0))[0] || null;
  if (c) alvo = outroDe(c, me);
  const painel = alvo ? painelConversa(alvo, c) : '<section class="conversa nada"><p class="chat-vazio">Busque uma pessoa para começar.</p></section>';
  return `<div class="chat ${alvo ? 'aberta' : 'lista-so'}">
    <aside class="chat-lado">
      <div class="chat-topo"><h1>Bate-papo</h1>
        <div class="campo-busca">${ic('busca')}<input type="search" data-chat-busca value="${esc(chat.busca)}" placeholder="Buscar pessoa" aria-label="Buscar pessoa"></div>
        <div class="pilulas" id="chat-filtros">${filtrosChat()}</div></div>
      <nav id="chat-lista" aria-label="Conversas e pessoas">${listaChat(c)}</nav>
    </aside>${painel}</div>`;
}

function atualizarListaChat() {
  const r = location.hash.replace(/^#\/?/, '').split('/');
  const atual = r[1] && r[1] !== 'p' ? minhasConversas(eu()).find(x => x.id === r[1]) : null;
  document.getElementById('chat-lista').innerHTML = listaChat(atual || null);
  document.getElementById('chat-filtros').innerHTML = filtrosChat();
}

function enviarNaConversa(paraId, dados) {
  const me = eu();
  let c = conversaCom(me.id, paraId);
  if (!c) { c = { id: novoId(), participantes: [me.id, paraId] }; db.conversas.push(c); }
  db.mensagens.push(Object.assign({ id: novoId(), cid: c.id, autorId: me.id, data: Date.now() }, dados));
  salvar();
  return c;
}

function abrirConversa(c) {
  chat.busca = ''; chat.papel = '';
  const destino = `#/chat/${c.id}`;
  if (location.hash === destino) render(); else location.hash = destino;
  setTimeout(() => { const i = document.getElementById('msg'); if (i) i.focus(); }, 0);
}

Object.assign(acoes, {
  chatPapel(b) { chat.papel = b.dataset.v; atualizarListaChat(); },
  chatAba(b) { chat.aba = b.dataset.v; atualizarListaChat(); },
  chatBuscarDentro() {
    chat.buscandoDentro = !chat.buscandoDentro; chat.dentro = '';
    render();
    const i = document.querySelector('[data-chat-dentro]');
    if (i) i.focus();
  },
  verPessoa(b) {
    const p = pessoa(b.dataset.id), t = p.papel === 'aluno' ? doAluno(p.id) : null;
    const linha = (k, v) => `<div class="perfil-linha"><span>${k}</span><strong>${esc(v)}</strong></div>`;
    abrirModal(p.nome, `<div>${linha('Perfil', PAPEL[p.papel])}${linha('Curso', p.curso)}${linha('E-mail', p.email)}${t ? linha('TCC', t.tema) + linha('Orientação', t.orientadorId ? nomeDe(t.orientadorId) : 'A definir') : ''}</div>
      <div class="m-fim"><button type="button" class="btn sec" data-acao="fecharModal">Fechar</button></div>`);
  }
});

forms.mensagem = (f, d) => {
  const texto = String(d.get('texto')).trim();
  if (!texto) return;
  abrirConversa(enviarNaConversa(f.dataset.para, { texto }));
};

document.addEventListener('input', e => {
  const el = e.target;
  if (el.hasAttribute('data-chat-busca')) {
    chat.busca = el.value;
    atualizarListaChat();
  }
  if (el.dataset.chatDentro) {
    chat.dentro = el.value;
    const box = document.getElementById('msgs');
    box.innerHTML = bolhas(el.dataset.chatDentro, pessoa(el.dataset.alvo));
    if (!el.value.trim()) box.scrollTop = box.scrollHeight;
  }
});

document.addEventListener('change', e => {
  const el = e.target;
  if (!el.dataset.anexo || !el.files[0]) return;
  const file = el.files[0];
  if (file.size > 25 * 1048576) return aviso('O arquivo passa de 25 MB.');
  const id = novoId();
  arquivos.guardar(id, file).then(() => abrirConversa(enviarNaConversa(el.dataset.anexo, { texto: '', anexo: { id, nome: file.name, tam: file.size } })));
});
