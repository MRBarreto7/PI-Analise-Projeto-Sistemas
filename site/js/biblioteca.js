'use strict';
/* Biblioteca: acervo de TCs com busca, filtros, página de cada trabalho, salvos e aprovação da coordenação. */

const POR_PAGINA = 8;
const FACETAS = [['curso', 'Curso'], ['area', 'Área'], ['ano', 'Ano'], ['orientador', 'Orientação']];
const ORDENS = [['recentes', 'Mais recentes'], ['baixados', 'Mais baixados'], ['titulo', 'Título, A a Z']];
const AREAS = ['Banco de Dados', 'Engenharia de Software', 'Inteligência Artificial', 'Interação Humano-Computador', 'Redes e Segurança', 'Sistemas Embarcados e IoT'];
const bib = { q: '', f: { curso: [], area: [], ano: [], orientador: [] }, ordem: 'recentes', pagina: 1, aba: 'todos' };

function limparBib() {
  Object.assign(bib, { q: '', ordem: 'recentes', pagina: 1, aba: 'todos' });
  FACETAS.forEach(([k]) => { bib.f[k] = []; });
}
const tc = id => db.biblioteca.find(b => b.id === id);
const salvosDe = u => db.salvos[u.id] || [];
const pendentes = () => db.biblioteca.filter(b => b.status === 'pendente');
const podeEnviar = u => u.papel === 'orientador' || u.papel === 'coordenador';
const dataLonga = s => { const d = deIso(s); return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`; };
const STATUS_TC = { publicado: { txt: 'Publicado', cor: 'verde' }, pendente: { txt: 'Aguardando aprovação', cor: 'ambar' }, recusado: { txt: 'Recusado', cor: 'vermelho' } };

function conjunto() {
  const me = eu();
  if (bib.aba === 'salvos') return db.biblioteca.filter(b => b.status === 'publicado' && salvosDe(me).includes(b.id));
  if (bib.aba === 'envios') return db.biblioteca.filter(b => b.enviadoPor === me.id);
  if (bib.aba === 'aprovar') return pendentes();
  return db.biblioteca.filter(b => b.status === 'publicado');
}
function casa(b, exceto) {
  const termos = norm(bib.q).split(/\s+/).filter(Boolean);
  const texto = norm([b.titulo, b.autor, b.orientador, b.area, b.palavras.join(' '), b.resumo].join(' '));
  if (!termos.every(t => texto.includes(t))) return false;
  return FACETAS.every(([k]) => k === exceto || !bib.f[k].length || bib.f[k].includes(String(b[k])));
}
function ordenados() {
  const regra = { recentes: (a, b) => b.defesa.localeCompare(a.defesa), baixados: (a, b) => b.downloads - a.downloads, titulo: (a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR') };
  return conjunto().filter(b => casa(b)).sort(regra[bib.ordem]);
}

function facetasHtml() {
  return FACETAS.map(([k, nome]) => {
    const cont = {};
    conjunto().filter(b => casa(b, k)).forEach(b => { cont[b[k]] = (cont[b[k]] || 0) + 1; });
    bib.f[k].forEach(v => { cont[v] = cont[v] || 0; });
    const valores = Object.keys(cont).sort(k === 'ano' ? (a, b) => b - a : (a, b) => a.localeCompare(b, 'pt-BR'));
    if (!valores.length) return '';
    return `<fieldset class="faceta"><legend>${nome}</legend>${valores.map(v => `<label class="check"><input type="checkbox" data-faceta="${k}" value="${esc(v)}" ${bib.f[k].includes(v) ? 'checked' : ''}><span>${esc(v)}</span><small>${cont[v]}</small></label>`).join('')}</fieldset>`;
  }).join('');
}

function cartaoTc(b) {
  const me = eu(), salvo = salvosDe(me).includes(b.id);
  const estado_ = b.status !== 'publicado' ? `<p>${status(STATUS_TC[b.status])}</p>` : '';
  return `<article class="tc"><div class="tc-texto">
      <a class="tc-titulo" href="#/biblioteca/${b.id}">${marcar(b.titulo, bib.q)}</a>
      <p class="tc-meta">${marcar(b.autor, bib.q)}, ${esc(b.ano)}. Orientação: ${marcar(b.orientador, bib.q)}</p>
      <p class="tc-resumo">${marcar(b.resumo, bib.q)}</p>${estado_}
      <div class="tags">${b.palavras.map(p => `<button class="tag" data-acao="buscarTag" data-v="${esc(p)}">${marcar(p, bib.q)}</button>`).join('')}</div></div>
    ${b.status === 'publicado' ? `<button class="salvar${salvo ? ' on' : ''}" data-acao="salvarTc" data-id="${b.id}" aria-pressed="${salvo}" aria-label="${salvo ? 'Remover dos salvos' : 'Salvar'}" title="${salvo ? 'Remover dos salvos' : 'Salvar'}">${ic('salvar', 19)}</button>` : ''}</article>`;
}

function resultadosHtml() {
  const lista = ordenados(), total = lista.length, paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  bib.pagina = Math.min(bib.pagina, paginas);
  const pagina = lista.slice((bib.pagina - 1) * POR_PAGINA, bib.pagina * POR_PAGINA);
  const ativos = FACETAS.flatMap(([k]) => bib.f[k].map(v => [k, v]));
  const vazio = bib.aba === 'salvos' && !bib.q && !ativos.length ? 'Nenhum trabalho salvo ainda.' : bib.aba === 'aprovar' && !bib.q ? 'Nenhum TC aguardando aprovação.' : bib.aba === 'envios' && !bib.q ? 'Nenhum TC enviado por você.' : 'Nenhum trabalho encontrado.';
  return `<div class="res-topo"><p class="total">${total === 1 ? '1 trabalho' : `${total} trabalhos`}</p>
      <label class="ordem">Ordenar por <select data-bib-ordem>${ORDENS.map(([v, n]) => `<option value="${v}" ${bib.ordem === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label></div>
    ${ativos.length ? `<div class="ativos">${ativos.map(([k, v]) => `<button class="ativo" data-acao="tirarFiltro" data-k="${k}" data-v="${esc(v)}" aria-label="Tirar filtro ${esc(v)}">${esc(v)}${ic('fechar', 13)}</button>`).join('')}<button class="link" data-acao="limparFiltros">Limpar</button></div>` : ''}
    <div class="lista">${pagina.map(cartaoTc).join('') || `<p class="vazio">${vazio}</p>`}</div>
    ${paginas > 1 ? `<nav class="paginas" aria-label="Páginas">${Array.from({ length: paginas }, (_, i) => `<button data-acao="paginaBib" data-n="${i + 1}" ${i + 1 === bib.pagina ? 'aria-current="page"' : ''}>${i + 1}</button>`).join('')}</nav>` : ''}`;
}

function atualizarBib(focoFaceta) {
  document.getElementById('resultados').innerHTML = resultadosHtml();
  document.getElementById('facetas').innerHTML = facetasHtml();
  if (focoFaceta) { const i = document.querySelector(`[data-faceta="${focoFaceta.k}"][value="${CSS.escape(focoFaceta.v)}"]`); if (i) i.focus(); }
}

function vBiblioteca(r) {
  if (r[1]) return detalheTc(r[1]);
  const me = eu();
  if (bib.aba === 'envios' && me.papel !== 'orientador') bib.aba = 'todos';
  if (bib.aba === 'aprovar' && me.papel !== 'coordenador') bib.aba = 'todos';
  const abas = [['todos', 'Acervo'], ['salvos', `Salvos (${salvosDe(me).length})`]];
  if (me.papel === 'orientador') abas.push(['envios', 'Meus envios']);
  if (me.papel === 'coordenador') abas.push(['aprovar', `Para aprovar (${pendentes().length})`]);
  const publicados = db.biblioteca.filter(b => b.status === 'publicado').length;
  return cabeca('Biblioteca', `${publicados} trabalhos de conclusão disponíveis para consulta.`, podeEnviar(me) ? `<button class="btn" data-acao="novoTc">${ic('mais', 16)}Enviar TC</button>` : '') + `
    <nav class="abas abas-botao" aria-label="Seções da biblioteca">${abas.map(([v, n]) => `<button data-acao="abaBib" data-v="${v}" aria-current="${bib.aba === v}">${esc(n)}</button>`).join('')}</nav>
    <div class="campo-busca bib-busca">${ic('busca')}<input type="search" data-bib-busca value="${esc(bib.q)}" placeholder="Buscar por título, autor, orientação, tema ou palavra-chave" aria-label="Buscar na biblioteca"></div>
    <button class="btn sec bib-filtrar" data-acao="abrirFiltros">${ic('filtro', 16)}Filtros</button>
    <div class="bib"><aside class="facetas" id="facetas" aria-label="Filtros">${facetasHtml()}</aside><div id="resultados">${resultadosHtml()}</div></div>`;
}

function citacao(b) {
  const partes = b.autor.trim().split(/\s+/), sobrenome = partes.pop().toUpperCase();
  return `${sobrenome}, ${partes.join(' ')}. ${b.titulo}. ${b.ano}. ${b.paginas} f. Trabalho de Conclusão de Curso (Graduação em ${b.curso}) – Universidade de Santa Cruz do Sul, Santa Cruz do Sul, ${b.ano}.`;
}

function relacionados(b) {
  return db.biblioteca.filter(x => x.id !== b.id && x.status === 'publicado')
    .map(x => ({ x, n: (x.area === b.area ? 2 : 0) + x.palavras.filter(p => b.palavras.includes(p)).length }))
    .filter(o => o.n > 0).sort((a, c) => c.n - a.n || c.x.downloads - a.x.downloads).slice(0, 3).map(o => o.x);
}

function detalheTc(id) {
  const me = eu(), b = tc(id);
  const pode = b && (b.status === 'publicado' || me.papel === 'coordenador' || b.enviadoPor === me.id);
  if (!pode) return cabeca('Trabalho não encontrado') + '<a href="#/biblioteca">Voltar para a Biblioteca</a>';
  const salvo = salvosDe(me).includes(b.id);
  const dados = [['Autor', b.autor], ['Orientação', b.orientador], ['Banca', b.banca.join(', ')], ['Curso', b.curso], ['Área', b.area], ['Defesa', dataLonga(b.defesa)], ['Páginas', b.paginas], ['Downloads', b.downloads]];
  const rel = relacionados(b);
  const moderar = me.papel === 'coordenador'
    ? (b.status === 'pendente'
      ? `<button class="btn" data-acao="moderarTc" data-id="${b.id}" data-v="publicado">Aprovar</button><button class="btn sec" data-acao="moderarTc" data-id="${b.id}" data-v="recusado">Recusar</button>`
      : `<button class="btn perigo" data-acao="removerTc" data-id="${b.id}">Remover da biblioteca</button>`) : '';
  return `<a class="voltar" href="#/biblioteca">${ic('esquerda', 16)}Biblioteca</a>
    <div class="tc-pagina"><div class="tc-principal">
      <h1>${esc(b.titulo)}</h1>
      <p class="sub">${esc(b.autor)}, ${esc(b.ano)}</p>
      ${b.status !== 'publicado' ? `<p class="tc-estado">${status(STATUS_TC[b.status])}</p>` : ''}
      <section class="card"><h2>Resumo</h2><p>${esc(b.resumo)}</p>
        <div class="tags">${b.palavras.map(p => `<button class="tag" data-acao="buscarTag" data-v="${esc(p)}">${esc(p)}</button>`).join('')}</div></section>
      <section class="card"><h2>Como citar (ABNT)</h2><p class="citacao" id="citacao">${esc(citacao(b))}</p>
        <button class="btn sec peq" data-acao="copiarCitacao" data-id="${b.id}">${ic('copiar', 15)}Copiar citação</button></section>
      ${rel.length ? `<section class="card"><h2>Trabalhos relacionados</h2>${rel.map(x => `<a class="rel" href="#/biblioteca/${x.id}"><strong>${esc(x.titulo)}</strong><span>${esc(x.autor)}, ${esc(x.ano)}</span></a>`).join('')}</section>` : ''}
    </div>
    <aside class="tc-lado"><section class="card">
      <div class="tc-acoes"><button class="btn" data-acao="lerTc" data-id="${b.id}">Ler online</button><button class="btn sec" data-acao="baixarTc" data-id="${b.id}">Baixar PDF</button>
      ${b.status === 'publicado' ? `<button class="btn sec" data-acao="salvarTc" data-id="${b.id}" aria-pressed="${salvo}">${ic('salvar', 16)}${salvo ? 'Salvo' : 'Salvar'}</button>` : ''}${moderar}</div>
      <dl class="tc-dados">${dados.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></section></aside></div>`;
}

/* TC sem arquivo próprio (os de exemplo) ganha um PDF gerado na hora. */
function pdfDoTc(b) {
  const blocos = [{ t: 'Universidade de Santa Cruz do Sul', s: 12, m: 4 }, { t: `Curso de ${b.curso}`, s: 12, m: 40 }, { t: b.titulo, s: 20, b: true, m: 16 }, { t: b.autor, s: 14, m: 30 },
    { t: `Orientação: ${b.orientador}`, s: 12, m: 4 }, { t: `Banca: ${b.banca.join(', ')}`, s: 12, m: 4 }, { t: `Defesa: ${dataLonga(b.defesa)}`, s: 12, m: 30 }, { t: 'Resumo', s: 13, b: true, m: 6 }, { t: b.resumo, s: 12, m: 14 },
    { t: `Palavras-chave: ${b.palavras.join(', ')}.`, s: 12, m: 40 }, { t: 'Documento de exemplo do esboço da Central do TCC.', s: 10 }];
  return pdfSimples(blocos);
}
function arquivoDoTc(b) {
  return arquivos.ler(b.id).then(blob => blob || pdfDoTc(b));
}
function contarDownload(b) {
  b.downloads++; salvar();
}

Object.assign(acoes, {
  abaBib(b) { bib.aba = b.dataset.v; bib.pagina = 1; FACETAS.forEach(([k]) => { bib.f[k] = []; }); render(); },
  paginaBib(b) { bib.pagina = Number(b.dataset.n); atualizarBib(); window.scrollTo(0, 0); },
  tirarFiltro(b) { const { k, v } = b.dataset; bib.f[k] = bib.f[k].filter(x => x !== v); bib.pagina = 1; atualizarBib(); },
  limparFiltros() { FACETAS.forEach(([k]) => { bib.f[k] = []; }); bib.pagina = 1; atualizarBib(); },
  abrirFiltros() { document.getElementById('facetas').classList.toggle('aberto'); },
  buscarTag(b) {
    bib.q = b.dataset.v; bib.aba = 'todos'; bib.pagina = 1;
    FACETAS.forEach(([k]) => { bib.f[k] = []; });
    if (location.hash === '#/biblioteca') render(); else location.hash = '#/biblioteca';
  },
  salvarTc(b) {
    const me = eu(), lista = salvosDe(me), id = b.dataset.id;
    db.salvos[me.id] = lista.includes(id) ? lista.filter(x => x !== id) : lista.concat(id);
    salvar(); render();
    aviso(lista.includes(id) ? 'Removido dos salvos.' : 'Trabalho salvo.');
  },
  copiarCitacao(b) { copiar(citacao(tc(b.dataset.id))).then(() => aviso('Citação copiada.')); },
  baixarTc(b) {
    const t = tc(b.dataset.id);
    arquivoDoTc(t).then(blob => { salvarArquivo(blob, `${t.autor.replace(/\s+/g, '_')}_${t.ano}.pdf`); contarDownload(t); render(); });
  },
  lerTc(b) {
    const t = tc(b.dataset.id);
    arquivoDoTc(t).then(blob => {
      abrirModal(t.titulo, `<iframe class="leitor" src="${URL.createObjectURL(blob)}" title="${esc(t.titulo)}"></iframe>`, true);
    });
  },
  moderarTc(b) {
    tc(b.dataset.id).status = b.dataset.v;
    salvar(); render();
    aviso(b.dataset.v === 'publicado' ? 'TC publicado na biblioteca.' : 'TC recusado.');
  },
  removerTc(b) {
    if (!b.dataset.ok) { b.dataset.ok = '1'; b.textContent = 'Confirmar remoção'; return; }
    db.biblioteca = db.biblioteca.filter(x => x.id !== b.dataset.id);
    salvar(); location.hash = '#/biblioteca'; aviso('TC removido da biblioteca.');
  },
  novoTc() {
    const me = eu();
    const cursos = [...new Set(db.biblioteca.map(x => x.curso))].sort();
    abrirModal('Enviar TC', `<form class="m-corpo" style="padding:0" data-form="tc">
      <label class="campo">Título<input name="titulo" required></label>
      <div class="duas"><label class="campo">Autor<input name="autor" required></label>
      <label class="campo">Orientação<input name="orientador" value="${me.papel === 'orientador' ? esc(me.nome) : ''}" required></label></div>
      <div class="duas"><label class="campo">Curso<select name="curso">${cursos.map(c => `<option>${esc(c)}</option>`).join('')}</select></label>
      <label class="campo">Área<select name="area">${AREAS.map(a => `<option>${esc(a)}</option>`).join('')}</select></label></div>
      <div class="duas"><label class="campo">Data da defesa<input type="date" name="defesa" max="${paraIso(new Date())}" required></label>
      <label class="campo">Páginas<input type="number" name="paginas" min="1" required></label></div>
      <label class="campo">Banca<input name="banca" placeholder="Nomes separados por vírgula" required></label>
      <label class="campo">Palavras-chave<input name="palavras" placeholder="Separadas por vírgula" required></label>
      <label class="campo">Resumo<textarea name="resumo" required></textarea></label>
      <label class="campo">Arquivo em PDF<input type="file" name="arquivo" accept=".pdf" required></label>
      <label class="check"><input type="checkbox" name="autorizado" required>O autor autorizou a publicação na biblioteca</label>
      ${me.papel === 'orientador' ? `<p class="ajuda">A coordenação aprova antes de o TC aparecer no acervo.</p>` : ''}
      <div class="m-fim"><button type="button" class="btn sec" data-acao="fecharModal">Cancelar</button><button class="btn">Enviar</button></div></form>`);
  }
});

forms.tc = (f, d) => {
  const me = eu(), id = novoId(), lista = s => String(s).split(',').map(x => x.trim()).filter(Boolean), defesa = d.get('defesa');
  const arquivo = d.get('arquivo');
  if (!/\.pdf$/i.test(arquivo.name)) return aviso('O arquivo precisa ser PDF.');
  arquivos.guardar(id, arquivo).then(() => {
    db.biblioteca.push({
      id, titulo: String(d.get('titulo')).trim(), autor: String(d.get('autor')).trim(), orientador: String(d.get('orientador')).trim(), curso: d.get('curso'), area: d.get('area'),
      ano: Number(defesa.slice(0, 4)), paginas: Number(d.get('paginas')), palavras: lista(d.get('palavras')), resumo: String(d.get('resumo')).trim(), downloads: 0, banca: lista(d.get('banca')), defesa,
      status: me.papel === 'coordenador' ? 'publicado' : 'pendente', enviadoPor: me.id
    });
    salvar(); modal.close();
    if (me.papel === 'orientador') bib.aba = 'envios';
    render();
    aviso(me.papel === 'coordenador' ? 'TC publicado na biblioteca.' : 'Enviado para a coordenação aprovar.');
  });
};

document.addEventListener('input', e => {
  if (e.target.hasAttribute('data-bib-busca')) { bib.q = e.target.value; bib.pagina = 1; atualizarBib(); }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.faceta) {
    const k = el.dataset.faceta, v = el.value;
    bib.f[k] = el.checked ? bib.f[k].concat(v) : bib.f[k].filter(x => x !== v);
    bib.pagina = 1;
    atualizarBib({ k, v });
  }
  if (el.hasAttribute('data-bib-ordem')) { bib.ordem = el.value; bib.pagina = 1; atualizarBib(); }
});
