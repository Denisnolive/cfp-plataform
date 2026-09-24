# Spec Delta

## Purpose

Define o comportamento da tela de Cadastro de Eventos (/event/new) e os critérios de aceitação para validação de fluxos de sucesso e de tratamento de erros através de testes End-to-End tradicionais com Cypress.

## ADDED Requirements

### Requirement: O formulário de cadastro de eventos deve permitir a criação com dados válidos
A tela de cadastro de eventos (`/event/new`) SHALL permitir que o usuário cadastre um novo evento fornecendo as informações obrigatórias nos campos correspondentes (Nome, Endereço, Capacidade e Data) e realize a submissão bem-sucedida.

#### Scenario: Submissão bem-sucedida do formulário de cadastro de eventos
- **WHEN** o usuário acessa a rota `/event/new`, preenche os campos Nome, Endereço, Capacidade e Data válidos e aciona o botão de submissão
- **THEN** o sistema SHALL processar o cadastro e apresentar confirmação visual de submissão bem-sucedida

### Requirement: O formulário de cadastro de eventos deve exibir mensagens de validação ao submeter formulário vazio
A tela de cadastro de eventos (`/event/new`) SHALL validar a obrigatoriedade dos campos e impedir o envio quando o formulário for submetido vazio, exibindo mensagens de erro de validação nativas para os campos obrigatórios.

#### Scenario: Validação de campos obrigatórios ao submeter formulário vazio
- **WHEN** o usuário navega até a rota `/event/new` e aciona o botão de submeter com os campos do formulário vazios
- **THEN** o sistema SHALL bloquear a submissão e exibir visivelmente as mensagens de erro nativas de validação para os campos obrigatórios

### Requirement: A suíte de testes E2E deve ser implementada exclusivamente com comandos tradicionais do Cypress
A suíte de testes E2E para a funcionalidade de cadastro de eventos SHALL utilizar exclusivamente a sintaxe nativa e tradicional do Cypress (`cy.get()`, `cy.contains()`, `.should()`) e seletores CSS convencionais (`id`, `name`, `class`).

#### Scenario: Execução dos testes E2E com Cypress tradicional
- **WHEN** a suíte de testes E2E em `frontend-e2e/src/e2e/event-registration.cy.ts` for executada
- **THEN** as interações com formulários e asserções de validação SHALL ser resolvidas com sucesso usando APIs convencionais do Cypress sem bibliotecas externas de IA
