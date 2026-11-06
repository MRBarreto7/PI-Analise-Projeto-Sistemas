# Central do TCC: protótipo navegável

Esboço das telas do sistema de gestão de TCC, com dados fictícios. A intenção é evoluir para um sistema funcional.

- **Online:** https://mrbarreto7.github.io/PI-Analise-Projeto-Sistemas/site/
- **No computador:** baixe a pasta `site/` e abra o `index.html`. Não precisa instalar nada.

## Contas de teste

A tela de login é igual para todos, e o login define o painel. A senha de todas as contas é `1234`.

| Login | Pessoa (fictícia) | Painel |
|---|---|---|
| `aluno` | Ana Lima | Início, Entregas, Agenda, Bate-papo, Biblioteca |
| `orientador` | Paula Mendes | Início, Entregas, Agenda, Bate-papo, Biblioteca |
| `coordenador` | Marta Vieira | Alunos, Prazos, Bate-papo, Biblioteca |
| `banca` | Davi Antunes | Entregas, Bate-papo, Biblioteca |

Também entram `caio`, `marina`, `pedro`, `julia` e `lucas` (alunos), `rafael` e `sonia` (orientadores), `lia` e `otavio` (banca).

## O que cada perfil faz

- **Aluno:** envia as entregas, acompanha prazos e feedbacks e solicita reunião com o orientador.
- **Orientador:** vê as entregas e o andamento dos orientandos, dá feedback e nota, aceita ou recusa reuniões e envia TCs para a biblioteca.
- **Coordenador:** define o orientador de cada aluno, cria as entregas e os prazos, libera o acesso da banca e aprova os TCs enviados.
- **Banca:** dá feedback e nota nas entregas dos trabalhos liberados pela coordenação.

Todos os perfis usam o bate-papo e a biblioteca.

## Limites do protótipo

- Não há servidor. O login é simulado e os dados ficam no navegador de quem abre.
- Cada pessoa vê só o que fez no próprio navegador. Uma entrega enviada em um computador não aparece em outro.
- Para ver dois perfis interagindo, abra duas abas no mesmo navegador e entre com uma conta em cada uma.
- "Restaurar dados de exemplo", na tela de login, volta tudo ao início.
- Pessoas, trabalhos e TCs são fictícios. Não use senha real.

## Arquivos

- `index.html`: a página.
- `estilo.css`: o visual.
- `js/dados.js`: dados de exemplo.
- `js/app.js`: login, painéis, entregas, agenda e coordenação.
- `js/chat.js`: bate-papo.
- `js/biblioteca.js`: biblioteca.
