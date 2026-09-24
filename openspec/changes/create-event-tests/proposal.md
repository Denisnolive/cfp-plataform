# Proposal: Testes E2E com Cypress para Cadastro de Eventos

## Why

Garantir a confiabilidade e qualidade da tela de Cadastro de Eventos (`/event/new`) através de testes End-to-End (E2E) automatizados utilizando Cypress tradicional. A automação desses testes valida o fluxo crítico de cadastro de eventos (caminho feliz com preenchimento de campos obrigatórios) e o comportamento defensivo do formulário (exibição de mensagens nativas de erro de validação ao submeter formulário vazio), prevenindo regressões e assegurando a integridade da experiência do usuário.

## What Changes

- **Configuração do Cypress no ambiente E2E**: Ajustar/estruturar o suporte a testes Cypress no projeto de testes E2E (`frontend-e2e`).
- **Criação da suíte de testes E2E do Cadastro de Eventos**: Adicionar o arquivo de teste `event-registration.cy.ts` (em `frontend-e2e/src/e2e/event-registration.cy.ts`).
- **Cenário de Sucesso (Happy Path)**:
  - Navegação até `/event/new`.
  - Preenchimento dos campos obrigatórios (Nome, Endereço, Capacidade e Data) utilizando seletores CSS convencionais (`id`, `name` ou `class`).
  - Submissão do formulário.
  - Verificação de sucesso na criação do evento.
- **Cenário de Erro (Validation Errors)**:
  - Navegação até `/event/new`.
  - Submissão imediata do formulário vazio.
  - Asserções verificando a exibição das mensagens de erro nativas de validação para os campos obrigatórios.
- **Aderência às Diretrizes Tradicionais**:
  - Utilização exclusiva dos comandos nativos do Cypress (`cy.get()`, `cy.contains()`, `.should()`, etc.), sem dependência de bibliotecas externas de IA.

## Capabilities

### New Capabilities
- `event-registration`: Especificação do comportamento da tela de Cadastro de Eventos (`/event/new`) e seus critérios de aceitação validados via testes E2E (sucesso no cadastro e validação de campos vazios).

### Modified Capabilities
<!-- Nenhuma capacidade existente alterada. -->

## Impact

- **Código de Testes**: Novo arquivo `frontend-e2e/src/e2e/event-registration.cy.ts`.
- **Configuração de Testes**: Verificação e configuração do Cypress no projeto `frontend-e2e` (arquivos `cypress.config.ts`, suporte e tipagens necessárias).
- **Dependências**: Nenhuma dependência externa de IA será adicionada; utiliza-se o Cypress já instalado no projeto.
- **Aplicação Frontend**: Dependência da rota `/event/new` e seus seletores CSS convencionais para os campos Nome, Endereço, Capacidade e Data, botão de submissão e mensagens de erro.
