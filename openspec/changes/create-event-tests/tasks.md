# Tasks

## 1. Configuração e Estrutura do Cypress em frontend-e2e

- [x] 1.1 Configurar o ambiente do Cypress em `frontend-e2e` (definir `cypress.config.ts` com `specPattern: 'src/e2e/**/*.cy.ts'`, suporte básico e adequação do `tsconfig.json`) e verificar resolução correta dos tipos do Cypress
- [x] 1.2 Criar a estrutura de diretórios `frontend-e2e/src/e2e` para acomodar os arquivos de teste `.cy.ts` e verificar a existência do diretório

## 2. Implementação da Suíte de Testes E2E (event-registration.cy.ts)

- [x] 2.1 Criar o arquivo `frontend-e2e/src/e2e/event-registration.cy.ts` com a estrutura base da suíte (`describe('Cadastro de Eventos (/event/new)', ...)`) utilizando sintaxe tradicional do Cypress
- [x] 2.2 Implementar o Cenário de Sucesso (`it('deve cadastrar um evento com sucesso ao preencher todos os campos obrigatórios', ...)`): navegar para `/event/new`, preencher Nome, Endereço, Capacidade e Data via seletores CSS (`id`, `name` ou `class`), submeter e verificar o feedback de sucesso via `.should()`
- [x] 2.3 Implementar o Cenário de Erro (`it('deve exibir mensagens de erro nativas ao submeter formulário vazio', ...)`): navegar para `/event/new`, submeter o formulário vazio e validar as mensagens de erro nativas com `cy.get()` e `.should('be.visible')`

## 3. Validação e Conformidade

- [x] 3.1 Auditar o código do teste para garantir conformidade estrita com a Regra de Ouro (apenas `cy.get()`, `cy.contains()`, `should()`, sem bibliotecas externas de IA)
- [x] 3.2 Executar a suíte de testes com Cypress no modo headless e verificar a execução e aprovação dos cenários
