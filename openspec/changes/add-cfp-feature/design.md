# Design

## Context

O repositório é um monorepo gerido pelo Nx 23, estruturado com:
- `apps/frontend` (ou pasta raiz `frontend`): Aplicação Angular 21 com suporte a Standalone Components e SSR.
- `apps/api` (ou pasta raiz `api`): Aplicação NestJS 11 com Express e Jest configurado.
- `share-types` (path `@cfp-platform/share-types`): Biblioteca contendo interfaces TypeScript compartilhadas, incluindo `SpeakerDTO`.

Atualmente, `class-validator` e `class-transformer` não estão instalados nas dependências do projeto. A API do NestJS possui apenas o `AppController` padrão e a aplicação frontend exibe a tela de boas-vindas do Nx.

## Goals / Non-Goals

**Goals:**
- Projetar a arquitetura completa do fluxo de CFP conectando backend, frontend e biblioteca compartilhada.
- Definir DTO de validação estrita no NestJS com decoradores do `class-validator` implementando o contrato `SpeakerDTO`.
- Configurar o `ValidationPipe` global ou scoped no NestJS com `whitelist: true` e `forbidNonWhitelisted: true` para rejeitar payloads espúrios com HTTP 400.
- Modelar o componente standalone Angular 21 utilizando Signals (`signal`, `computed`) para gerenciar todo o ciclo de vida do formulário, validações síncronas e estado de submissão.
- Estruturar a semântica de acessibilidade WAI-ARIA em todo o template do formulário de submissão.
- Estabelecer a estratégia de testes unitários com Jest para frontend e backend, garantindo cobertura dos requisitos críticos (bloqueio de botão inicial no Angular e rejeição 400 no NestJS).

**Non-Goals:**
- Implementação de banco de dados relacional persistente (em um primeiro momento, armazenamento em memória ou repositório mock no serviço é suficiente para cumprir o contrato do CFP).
- Fluxo de autenticação de palestrantes ou painel administrativo de aprovação/rejeição de palestras.
- Upload de arquivos de apresentação ou anexos em PDF.

## Decisions

### 1. Reutilização do Contrato Compartilhado (`SpeakerDTO`)
- **Decisão:** Importar a interface `SpeakerDTO` de `@cfp-platform/share-types`. No backend, criar a classe `CreateSpeakerDto implements Omit<SpeakerDTO, 'id'>` (ou compatível com `SpeakerDTO`, gerando `id` no backend) anotada com decoradores de `class-validator`.
- **Alternativas consideradas:**
  - *Duplicar interfaces:* Rejeitado por quebrar o princípio DRY e o propósito do monorepo Nx.
  - *Colocar decoradores de class-validator diretamente na lib shared-types:* Rejeitado para evitar acoplar a biblioteca de tipos com dependências pesadas de validação que seriam incluídas no bundle do frontend.

### 2. Validação Estrita no NestJS via `class-validator` e `ValidationPipe`
- **Decisão:** Utilizar `ValidationPipe` configurado com `{ whitelist: true, forbidNonWhitelisted: true, transform: true }`. Decoradores aplicados: `@IsString()`, `@IsNotEmpty()`, `@IsEmail()`, `@IsBoolean()`.
- **Alternativas consideradas:**
  - *Validação manual nos controllers ou services:* Rejeitado por ser propenso a falhas e não padronizado no NestJS.
  - *Zod:* Rejeitado para seguir estritamente o padrão especificado do NestJS com `class-validator`.

### 3. Gerenciamento Reativo no Frontend com Angular Signals
- **Decisão:** Criar um modelo de estado baseado em Signals:
  - Signals para cada campo: `name = signal('')`, `email = signal('')`, `talkTitle = signal('')`, `isGDE = signal(false)`.
  - Signal para estado de submissão: `isSubmitting = signal(false)`, `submissionStatus = signal<'idle' | 'success' | 'error'>('idle')`.
  - Computed Signal para validade: `isValid = computed(() => ...)` e `canSubmit = computed(() => isValid() && !isSubmitting())`.
  - Botão de envio associado diretamente a `[disabled]="!canSubmit()"` e `[attr.aria-disabled]="!canSubmit()"`.
- **Alternativas consideradas:**
  - *Reactive Forms clássicos (`FormGroup` / `FormControl` com RxJS):* Embora comum no Angular, o uso puro de Signals moderno no Angular 21 simplifica o estado, melhora o rastreamento de mudanças sem Zone.js e cumpre a diretriz estrita do projeto.

### 4. Estrutura de Acessibilidade WAI-ARIA
- **Decisão:** 
  - Todos os campos com `<label for="...">` associado ao `id` do `<input>`.
  - Campos obrigatórios marcados com `required` e `aria-required="true"`.
  - Estados de validação comunicados com `[attr.aria-invalid]="fieldHasError()"` e `[attr.aria-describedby]="errorElementId"`.
  - Região de feedback/notificação com `role="alert"` e `aria-live="polite"` para anúncio imediato a leitores de tela.
- **Alternativas consideradas:**
  - *Apenas estilos visuais CSS:* Rejeitado por excluir usuários que utilizam tecnologias assistivas.

### 5. Estratégia de Testes Unitários Obrigatórios com Jest
- **Decisão:**
  - **Backend (`apps/api`):** Testes unitários com `Test.createTestingModule` para `CfpController` e `ValidationPipe` (ou testes de integração de controller com validação), assegurando que requisições com campos vazios, e-mail inválido ou propriedades desconhecidas disparem exceção HTTP 400.
  - **Frontend (`apps/frontend`):** Testes unitários do `CfpSubmissionComponent` com Jest e TestBed (ou componente isolado), verificando:
    1. Que os Signals iniciam nos estados padrão (`name: ''`, `isValid: false`, etc.).
    2. Que o botão de envio possui a propriedade `disabled === true` e atributo `aria-disabled="true"` no estado inicial.
    3. Que o preenchimento válido atualiza os Signals e habilita o botão de submissão.
- **Alternativas consideradas:**
  - *Karma / Jasmine:* Rejeitado, pois o monorepo padroniza o uso do executor Jest e a diretriz estrita exige Jest.

## Risks / Trade-offs

- **[Risco]** Ausência de `class-validator` e `class-transformer` no `package.json` atual do projeto.
  → **Mitigação:** Incluir como primeira tarefa a instalação e checagem de integridade das dependências com `npm install`.
- **[Risco]** Configuração de testes unitários no Angular do Nx 23 (que possui target `test` via `@angular/build:unit-test` ou `@nx/jest`).
  → **Mitigação:** Assegurar que o `jest.config` do frontend ou target de teste esteja alinhado para rodar a suíte Jest com suporte a DOM (`jsdom`).
- **[Risco]** Divergência entre `SpeakerDTO` e a criação de ID no backend.
  → **Mitigação:** O payload de envio do palestrante não deve exigir que o usuário forneça o `id`, o backend gera o `id` (ex: UUID) e responde com o `SpeakerDTO` completo contendo o identificador gerado.
