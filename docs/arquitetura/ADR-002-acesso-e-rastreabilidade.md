# ADR-002 — Controle de acesso e rastreabilidade

**Status:** Proposta  
**Contexto:** Alunos só podem consultar o próprio TCC; orientadores veem seus orientandos; avaliadores acessam TCCs aos quais estão vinculados; coordenação administra cadastros. Entregas e avaliações precisam de histórico.

## Alternativas
Permissões verificadas apenas na interface (insuficiente); permissões validadas no servidor em cada operação (escolhida).

## Decisão
Validar autenticação e autorização por perfil e vínculo no backend, armazenando autor e data/hora de entregas, avaliações, pareceres e mudanças relevantes. O acesso aos arquivos deverá passar por autorização.

## Consequências
Maior segurança e auditabilidade, ao custo de regras adicionais de autorização e de retenção/gestão dos registros.
