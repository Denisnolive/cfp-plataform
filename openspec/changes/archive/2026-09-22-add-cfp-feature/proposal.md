# Proposal

## Why

A plataforma necessita de um canal digital para que palestrantes possam submeter suas propostas de palestras para conferências (Call for Papers - CFP). Atualmente não há interface pública de submissão nem endpoint de recepção e validação de propostas no backend. Esta funcionalidade estabelece o fluxo ponta a ponta de inscrição de palestrantes, assegurando integridade dos dados através de tipagem compartilhada e validação rigorosa, além de proporcionar uma experiência acessível e moderna no frontend com Angular 21 e Signals.

## What Changes

- **Backend (NestJS em `apps/api`)**:
  - Instalação e configuração de `class-validator` e `class-transformer` para validação estrita.
  - Criação de DTO de submissão que implementa o contrato `SpeakerDTO` com decoradores de validação (`@IsNotEmpty`, `@IsEmail`, `@IsString`, `@IsBoolean`, etc.).
  - Criação do módulo, controller e serviço de CFP para processar a submissão via `POST /api/cfp` (ou `/api/speakers`).
  - Aplicação de `ValidationPipe` estrito (`whitelist: true`, `forbidNonWhitelisted: true`) garantindo resposta `400 Bad Request` para payloads inválidos ou com campos não permitidos.
  - Testes unitários com Jest cobrindo cenários de sucesso e rejeição estrita de payloads inválidos.

- **Frontend (Angular 21 em `apps/frontend`)**:
  - Implementação de componente standalone para o formulário de submissão de palestra.
  - Gerenciamento de estado reativo unicamente via Angular Signals (`signal`, `computed`).
  - Conformidade com WAI-ARIA para acessibilidade (atributos como `aria-invalid`, `aria-describedby`, `aria-required`, alertas de feedback com `role="alert"` e controle de foco).
  - Bloqueio reativo do botão de envio com base no estado dos Signals quando o formulário for inválido ou estiver em envio.
  - Serviço Angular para integração HTTP com a API consumindo a tipagem `SpeakerDTO`.
  - Testes unitários com Jest validando o estado inicial dos Signals, reatividade e o bloqueio do botão de envio.

- **Shared (`share-types`)**:
  - Reutilização do contrato `SpeakerDTO` exportado pela biblioteca compartilhada `@cfp-platform/share-types` para garantir consistência entre backend e frontend.

## Capabilities

### New Capabilities

- `cfp-submission`: Submissão de propostas de palestras por palestrantes, com validação de payload estrita no backend e interface acessível orientada a Signals no frontend.

### Modified Capabilities

Nenhuma capacidade existente alterada.

## Impact

- **Código Afetado**:
  - `apps/api`: Novo `CfpModule`, `CfpController`, `CfpService` e DTO com validação.
  - `apps/frontend`: Novo componente standalone `CfpSubmissionComponent`, serviço `CfpService`, e rotas/links de navegação.
- **Bibliotecas Compartilhadas**:
  - `share-types`: Importação do contrato `SpeakerDTO`.
- **Dependências**:
  - Adição de `class-validator` e `class-transformer` em `package.json`.
- **Testes**:
  - Criação de suítes de testes unitários com Jest em `api` e `frontend`.
