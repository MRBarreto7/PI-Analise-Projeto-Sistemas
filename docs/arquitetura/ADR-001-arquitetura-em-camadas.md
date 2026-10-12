# ADR-001 — Arquitetura em camadas para o Sistema de Gestão de TCC

**Status:** Proposta para o projeto acadêmico  
**Data:** Outubro de 2026

## Contexto
O sistema precisa registrar usuários com perfis diferentes (aluno, orientador, coordenação e banca), TCCs, etapas, entregas versionadas, orientações, pareceres e avaliações. É importante garantir controle de acesso por vínculo, rastreabilidade e facilidade de manutenção. O trabalho está na fase de projeto; a infraestrutura ainda não foi implementada.

## Alternativas consideradas
- **Monolito modular em camadas:** menor custo de desenvolvimento e deploy; atende às funcionalidades atuais.
- **Microserviços:** permitiria implantação independente, mas aumenta custos de comunicação, observabilidade e operação sem demanda demonstrada neste escopo.
- **Event-driven:** útil para notificações futuras, mas acrescenta complexidade desnecessária para o fluxo central.

## Decisão
Adotar **aplicação web monolítica modular, em três camadas**: apresentação web, serviços de aplicação e domínio, persistência de dados. Organizar o backend por módulos de negócio (usuários, TCCs, etapas, entregas, avaliações e banca), com validação de acesso em operações de consulta e alteração. Como referência de implementação, o desenho considera frontend web, API HTTP e banco relacional PostgreSQL; são **propostas técnicas**, não funcionalidades já implementadas.

## Consequências
**Positivas:** simplicidade operacional, regras de negócio centralizadas, transações consistentes, testes e manutenção mais diretos.  
**Negativas:** implantação conjunta dos módulos, possível gargalo único do backend, necessidade de refatoração caso a escala aumente muito.

## Decisões relacionadas
O acesso a um TCC só será concedido a usuários autorizados por perfil e vínculo. Arquivos de entregas ficam em armazenamento de objetos, com metadados e histórico de versões no banco. O instante de composição da banca apresenta divergência na Parte 2 e deverá ser alinhado com os requisitos consolidados antes da implementação.
