# Proposal

## Why

Atualmente, o sistema permite a submissão de propostas de palestras (CFP), mas organizadores e usuários não possuem uma interface visual para visualizar as palestras já submetidas. A criação de um Dashboard resolve essa necessidade, permitindo listar todas as propostas cadastradas com uma experiência reativa, acessível e consistente com a identidade visual já estabelecida.

## What Changes

- **Backend (NestJS)**: Disponibilização/validação formal da rota `GET /api/cfp` no `CfpController` retornando a coleção de propostas (`SpeakerDTO[]`) a partir do `CfpService`.
- **Frontend (Angular 21)**: Criação do componente standalone `CfpDashboardComponent` utilizando Angular Signals (`WritableSignal<SpeakerDTO[]>`) para gerenciar o estado da listagem.
- **Frontend Service**: Consumo do endpoint `GET /api/cfp` via `HttpClient` (com método dedicado no serviço ou injeção direta no componente conforme diretrizes).
- **UX/UI & Design Tokens**: Implementação da visualização usando HTML semântico (lista de cards ou tabela acessível) reutilizando rigorosamente os tokens visuais de tipografia, cores, bordas e espaçamentos do formulário de submissão original.
- **Roteamento & Navegação**: Configuração da rota `dashboard` nas rotas do Angular (`app.routes.ts`) e adição de botão/link de navegação entre a tela de submissão e o novo Dashboard.

## Capabilities

### New Capabilities
- `cfp-dashboard`: Permite a visualização organizada e reativa das palestras submetidas através de um Dashboard web, integrando o consumo de dados via HTTP e estado em Signals.

### Modified Capabilities
- `cfp-submission`: Adiciona ponto de navegação no formulário de submissão direcionando o usuário para a rota de visualização do Dashboard mantendo a consistência visual.

## Impact

- **Código Frontend**: Novos arquivos para o componente `CfpDashboardComponent` (`.ts`, `.html`, `.css`, `.spec.ts`), atualização de `app.routes.ts` e atualização de `CfpSubmissionComponent` (template e estilos para navegação).
- **Código Backend**: Validação e garantia de testes do endpoint `GET /api/cfp` no `CfpController` e `CfpService`.
- **Dependências & Contratos**: Reutilização do contrato existente `SpeakerDTO` de `@cfp-platform/share-types`. Sem adição de novas dependências externas.
