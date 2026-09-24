# Design: Testes E2E com Cypress para Cadastro de Eventos

## Context

A plataforma utiliza arquitetura monorepo com Nx, possuindo um frontend Angular em `frontend/` e backend NestJS em `api/`.
Para validação de ponta a ponta, o repositório já possui pacotes `@nx/cypress` e `cypress` instalados.
A necessidade atual é implementar uma suíte de testes E2E robusta e padronizada utilizando Cypress tradicional para validar a página de Cadastro de Eventos (`/event/new`).

## Goals / Non-Goals

**Goals:**
- Configurar/estruturar o ambiente do Cypress em `frontend-e2e` para suportar a execução de arquivos com extensão `.cy.ts`.
- Implementar o arquivo `frontend-e2e/src/e2e/event-registration.cy.ts` cobrindo o fluxo de sucesso (preenchimento completo e submissão) e o fluxo de erro (submissão de formulário vazio com validações nativas).
- Empregar seletores CSS convencionais (`id`, `name`, `class`) e sintaxe tradicional do Cypress (`cy.get()`, `cy.contains()`, `should()`).
- Garantir testes determinísticos e resilientes a variações de estado de rede/backend através de stubs ou interceptadores quando aplicável.

**Non-Goals:**
- Não utilizar bibliotecas externas de automação assistida por IA, plugins de auto-healing ou asserções não-nativas do Cypress.
- Não alterar as especificações existentes de `cfp-submission` ou `cfp-dashboard`.

## Decisions

### 1. Estrutura de Arquivos e Configuração do Cypress
- **Decisão**: Localizar o arquivo de teste em `frontend-e2e/src/e2e/event-registration.cy.ts`. Garantir que `frontend-e2e/cypress.config.ts` (ou a configuração Cypress correspondente) aponte `specPattern: 'src/e2e/**/*.cy.ts'` e `baseUrl: 'http://localhost:4200'`.
- **Alternativa Considerada**: Criar uma nova aplicação separada `cypress-e2e`. Rejeitada para evitar redundância e manter todos os testes E2E de frontend agrupados no projeto `frontend-e2e`.

### 2. Estratégia de Seletores CSS
- **Decisão**: Utilizar seletores CSS padrão como solicitado:
  - Campo Nome: `input[name="name"]`, `#name` ou `.event-name`
  - Campo Endereço: `input[name="address"]`, `#address` ou `.event-address`
  - Campo Capacidade: `input[name="capacity"]`, `#capacity` ou `.event-capacity`
  - Campo Data: `input[name="date"]`, `#date` ou `.event-date`
  - Botão de Envio: `button[type="submit"]` ou `.submit-button`
- **Alternativa Considerada**: Utilizar seletores baseados em texto ou atributos de acessibilidade exclusivamente. Os seletores CSS convencionais atendem diretamente à diretriz obrigatória do projeto.

### 3. Isolamento e Resiliência dos Testes
- **Decisão**: Utilizar `cy.intercept()` para simular/mockar respostas de API (como `POST /api/events` ou rotas análogas) durante os cenários de teste, assegurando que o teste E2E foque estritamente no comportamento e feedback da interface.
- **Alternativa Considerada**: Exigir banco de dados em execução. Rejeitada pela fragilidade e lentidão em pipelines de CI para validações de interface do usuário.

### 4. Asserções e Validações
- **Decisão**: Empregar exclusivamente comandos encadeados com `.should()`:
  - Verificação de visibilidade: `.should('be.visible')`
  - Verificação de mensagens de erro: `.should('contain.text', ...)` ou validação de pseudo-classes/mensagens de validação nativas (`:invalid`, `required`).
  - Verificação de sucesso: asserção de mensagem de sucesso (`cy.contains('sucesso', { matchCase: false })`) ou redirecionamento de URL.

## Risks / Trade-offs

- **[Risco] Conflito de tipos entre Playwright e Cypress no mesmo projeto**: `frontend-e2e` possui configurações de Playwright.
  → *Mitigação*: Configurar `tsconfig.json` do Cypress (ex: `tsconfig.e2e.json` ou subpasta) com os tipos `"types": ["cypress"]`, evitando colisão com `@playwright/test`.
- **[Risco] A rota `/event/new` ou os campos do formulário estarem pendentes de implementação**:
  → *Mitigação*: O arquivo de teste E2E define o contrato de aceitação preciso. Caso a rota/componente ainda não esteja ativo, o teste servirá como especificação executável (TDD/E2E First), e o plano de tarefas inclui a verificação e mapeamento da rota na aplicação se necessário.
