# Design

## Context

A aplicação `cfp-platform` é estruturada em um monorepo Nx contendo:
- **Backend (`api`)**: NestJS com arquitetura modular. O `CfpController` e `CfpService` já possuem a estrutura básica do método `findAll()`, que retorna `SpeakerDTO[]` sob o caminho `/api/cfp`.
- **Frontend (`frontend`)**: Angular 21 utilizando standalone components e reatividade com Angular Signals. O formulário existente em `CfpSubmissionComponent` adota uma identidade visual moderna e limpa com tokens CSS explícitos (fundo `#f8fafc`, cartões em `#ffffff` com bordas `#e2e8f0` e sombra suave, botões primários em `#2563eb` e tipografia padrão do sistema).
- **Tipos compartilhados (`share-types`)**: Exporta a interface `SpeakerDTO` contendo `id`, `name`, `email`, `talkTitle` e `isGDE`.

## Goals / Non-Goals

**Goals:**
- Implementar o componente `CfpDashboardComponent` no Angular 21 utilizando standalone components.
- Injetar `HttpClient` no componente (ou integrá-lo via serviço compatível) para consultar `GET /api/cfp`.
- Gerenciar o estado das palestras através de Signals (`WritableSignal<SpeakerDTO[]>`), além de sinais auxiliares para controle de carregamento e mensagens de erro/estado vazio.
- Estruturar a interface com HTML semântico (tabela de dados acessível ou grid de cards semânticos) respeitando estritamente a identidade visual e Design Tokens do `CfpSubmissionComponent`.
- Configurar a rota `path: 'dashboard'` em `app.routes.ts` e adicionar botão/link de navegação recíproca entre formulário e Dashboard.
- Garantir testes unitários abrangentes para o controller do backend e para o novo componente do frontend.

**Non-Goals:**
- Ações de edição, exclusão ou paginação no servidor (out of scope para este incremento).
- Autenticação ou restrição de perfis de acesso para a visualização das palestras.
- Alteração da assinatura do contrato `SpeakerDTO`.

## Decisions

### 1. Injeção de dependência e consumo HTTP no Frontend
- **Decisão**: Conforme os requisitos do usuário, o `CfpDashboardComponent` injetará diretamente `HttpClient` (via função `inject(HttpClient)` do Angular 21) para realizar a requisição `GET /api/cfp`, atualizando um `WritableSignal<SpeakerDTO[]>`. Opcionalmente, o `CfpService` existente também poderá ter seu método `getAllProposals(): Observable<SpeakerDTO[]>` alinhado para reutilização e manutenibilidade.
- **Alternativas consideradas**:
  - Utilizar unicamente serviços: Embora serviços encapsulem endpoints, a injeção do `HttpClient` solicitada pelo usuário no componente permite manter o componente auto-suficiente ou interagir diretamente com o backend com menos camadas.

### 2. Gerenciamento de Estado com Signals
- **Decisão**: Utilizar `proposals = signal<SpeakerDTO[]>([])` para armazenar o array de palestras. Computar estados derivados se necessário (ex: `hasProposals = computed(() => this.proposals().length > 0)`, `totalGDEs = computed(() => this.proposals().filter(p => p.isGDE).length)`).
- **Alternativas consideradas**:
  - RxJS Subject / BehaviorSubject tradicional: Descartado em favor do padrão moderno do Angular 21 com Signals nativos.

### 3. Estrutura de UX/UI e Consistência com Design Tokens
- **Decisão**: Utilizar uma tabela HTML semântica (`<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th scope="col">`, `<td>`) envolta em container responsivo ou cards semânticos (`<article>`).
  - **Tokens aplicados**:
    - Fundo da página: `#f8fafc`
    - Superfície de cartões/tabelas: `#ffffff` com borda `1px solid #e2e8f0` e sombra `0 4px 6px -1px rgba(0,0,0,0.1)`
    - Tipografia: Títulos em `#1e293b`, textos secundários em `#64748b`, textos principais em `#0f172a`
    - Destaque GDE: Badge visual arredondado em tom azul/verde suave (`background-color: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; font-weight: 600`)
    - Botões de navegação: Botão secundário estilizado com borda `#cbd5e1`, cor de texto `#334155` e hover suave, alinhado à estética dos botões primários `#2563eb`.

### 4. Roteamento Angular
- **Decisão**: Adicionar em `app.routes.ts`:
  ```typescript
  {
    path: 'dashboard',
    loadComponent: () => import('./cfp/cfp-dashboard.component').then(m => m.CfpDashboardComponent),
  }
  ```
  (ou import direto para manter consistência com `appRoutes` existente).
  No formulário `CfpSubmissionComponent`, adicionar link/botão para navegar até `/dashboard`. No `app.html` (cabeçalho da aplicação), atualizar também os links de navegação para que o usuário possa alternar facilmente.

## Risks / Trade-offs

- **[Risco] Backend em memória**: O `CfpService` mantém as palestras cadastradas em memória (`proposals: SpeakerDTO[] = []`), sendo reinicializado a cada restart do servidor.
  → **Mitigação**: Adequado para o escopo atual de desenvolvimento e demonstração.
- **[Risco] Acessibilidade de tabelas em telas pequenas**: Tabelas HTML podem quebrar layout em resoluções mobile.
  → **Mitigação**: Envolver a tabela em um container com rolagem horizontal fluida (`overflow-x: auto`) e considerar layout adaptável com CSS semântico.
