# Tasks

## 1. Backend: Validação e Testes do Endpoint GET

- [x] 1.1 Verificar e validar o endpoint `GET /api/cfp` no `CfpController` e o método `findAll()` no `CfpService`, garantindo o retorno de `SpeakerDTO[]`
- [x] 1.2 Complementar testes unitários em `api/src/app/cfp/cfp.controller.spec.ts` cobrindo cenários com propostas cadastradas e lista vazia, verificando sucesso com `npx nx test api`

## 2. Frontend: Serviço e Integração HTTP

- [x] 2.1 Adicionar método de busca `getProposals(): Observable<SpeakerDTO[]>` em `frontend/src/app/cfp/cfp.service.ts` para consumo de `GET /api/cfp`
- [x] 2.2 Atualizar testes unitários em `frontend/src/app/cfp/cfp.service.spec.ts` para validar a requisição HTTP GET usando `HttpTestingController`, verificando com `npx nx test frontend`

## 3. Frontend: Criação do CfpDashboardComponent

- [x] 3.1 Criar o componente standalone `CfpDashboardComponent` em `frontend/src/app/cfp/cfp-dashboard.component.ts` injetando `HttpClient` (e/ou `CfpService`) e gerenciando o estado via Angular Signals (`WritableSignal<SpeakerDTO[]>`, `isLoading`, `errorMessage`)
- [x] 3.2 Criar o template semântico em `frontend/src/app/cfp/cfp-dashboard.component.html` com estrutura de tabela semântica (`<table>`, `<caption>`, `<thead>`, `<tbody>`) ou cards semânticos, destaque para palestrantes GDE e mensagem para estado vazio
- [x] 3.3 Criar o arquivo de estilos `frontend/src/app/cfp/cfp-dashboard.component.css` aplicando rigorosamente os Design Tokens do formulário (cores `#f8fafc`, `#ffffff`, `#1e293b`, `#64748b`, `#2563eb`, `#e2e8f0`, sombras e bordas arredondadas)
- [x] 3.4 Criar testes unitários em `frontend/src/app/cfp/cfp-dashboard.component.spec.ts` cobrindo carregamento via Signals, renderização de palestras, badge de GDE e estado vazio

## 4. Roteamento e Navegação

- [x] 4.1 Adicionar a rota `{ path: 'dashboard', component: CfpDashboardComponent }` em `frontend/src/app/cfp/app.routes.ts` (ou `frontend/src/app/app.routes.ts`)
- [x] 4.2 Adicionar botão de navegação para o Dashboard no formulário `CfpSubmissionComponent` com estilo compatível aos Design Tokens
- [x] 4.3 Adicionar botão de navegação para retornar à submissão no `CfpDashboardComponent` e atualizar o menu em `frontend/src/app/app.html`
- [x] 4.4 Atualizar testes existentes do `CfpSubmissionComponent` e `app.spec.ts` para validar os elementos de navegação e rotas

## 5. Validação e Qualidade

- [x] 5.1 Executar a suíte de testes unitários do frontend (`npx nx test frontend`) e verificar aprovação
- [x] 5.2 Executar a suíte de testes unitários do backend (`npx nx test api`) e verificar aprovação
- [x] 5.3 Executar o build de produção do frontend (`npx nx build frontend`) e do backend (`npx nx build api`) para assegurar ausência de erros de compilação
