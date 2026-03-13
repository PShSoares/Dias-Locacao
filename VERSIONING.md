# Politica de Versionamento

Este projeto usa dois niveis de versao para atender governanca de produto e rastreabilidade tecnica por commit.

## 1) Versao de Produto (Release)

Formato: SemVer

- major.minor.patch

Regras:

- MAJOR: mudanca incompativel
- MINOR: nova feature compatível
- PATCH: correcao sem quebrar contrato

Exemplos:

- 0.1.0: primeira release funcional
- 0.2.0: novo modulo de manutencao
- 0.2.1: correcao de calculo de inadimplencia

Arquivo fonte oficial:

- VERSION

## 2) Versao de Build por Commit

Formato recomendado:

- <versao_produto>+build.<numero_commit>.<sha_curto>

Exemplo:

- 0.2.1+build.138.a1b2c3d

Regras:

- Atualiza automaticamente a cada commit
- Nao precisa alterar arquivo de versao de produto
- Usada para rastrear exatamente o codigo em execucao

## 3) Convencao de Commits

Padrao: Conventional Commits

Tipos principais:

- feat: nova funcionalidade
- fix: correcao
- refactor: refatoracao sem mudar comportamento
- docs: documentacao
- chore: tarefa tecnica sem impacto funcional
- test: testes

Exemplos:

- feat(payments): adicionar baixa parcial de pagamento
- fix(rentals): corrigir calculo de km final
- docs(readme): detalhar arquitetura multi-tenant

## 4) Regra de Bump por Release

- feat -> bump minor
- fix -> bump patch
- BREAKING CHANGE -> bump major

## 5) Fluxo de Release

1. Trabalhar em branch de feature com commits convencionais.
2. Abrir PR para main.
3. CI valida testes, lint e build.
4. Ao aprovar release, atualizar arquivo VERSION.
5. Criar tag no formato vX.Y.Z.
6. Publicar changelog.

## 6) Changelog

- Gerado automaticamente a partir de commits convencionais.
- Estrutura por versao e data.
- Incluir secoes: Features, Fixes, Breaking Changes.

## 7) Como obter versao atual no runtime

Aplicacao deve expor no endpoint de health:

- productVersion: conteudo de VERSION
- buildVersion: productVersion + metadados de commit
- gitSha: hash do commit

## 8) Politica para ambientes

- dev: usa versao de build por commit
- staging: usa versao tagueada candidata
- production: somente versao tagueada oficial

## 9) Governanca

- Nenhum deploy em producao sem tag SemVer
- Todo commit deve seguir convencao
- Toda release deve ter notas de mudanca
