# Tasks

## 1. Setup e Dependências Compartilhadas

- [x] 1.1 Instalar as dependências `class-validator` e `class-transformer` no monorepo e verificar instalação bem-sucedida via `npm list class-validator class-transformer`
- [x] 1.2 Validar a integridade do contrato `SpeakerDTO` exportado por `@cfp-platform/share-types` e verificar a resolução correta dos caminhos no TypeScript

## 2. Backend (NestJS em `apps/api`)

- [ ] 2.1 Criar o DTO de submissão de CFP (`CreateSpeakerDto`) implementando o contrato `SpeakerDTO` com decoradores de validação estrita (`@IsNotEmpty`, `@IsString`, `@IsEmail`, `@IsBoolean`) e verificar ausência de erros de compilação
- [ ] 2.2 Implementar `CfpService` e `CfpController` com endpoint `POST /api/cfp`, consumindo o DTO com `@Body()` e aplicando `ValidationPipe` com `whitelist: true` e `forbidNonWhitelisted: true`
- [ ] 2.3 Configurar e registrar `CfpModule` no `AppModule` e verificar o build do backend através do comando `nx build api`
- [ ] 2.4 Criar testes unitários com Jest para o controller/validação do CFP em `apps/api`, assegurando que payloads inválidos (campos vazios, e-mail malformatado ou campos extras) sejam rejeitados com HTTP 400 Bad Request, e verificar execução com `nx test api`

## 3. Frontend (Angular 21 em `apps/frontend`)

- [x] 3.1 Criar o serviço `CfpService` em `apps/frontend` consumindo `SpeakerDTO` para realizar a requisição HTTP `POST /api/cfp` e verificar tipagem estrita
- [x] 3.2 Desenvolver o componente standalone `CfpSubmissionComponent` utilizando Angular Signals (`signal`, `computed`) para gerenciar todo o estado dos campos, validação reativa e controle do fluxo de submissão
- [x] 3.3 Implementar conformidade de acessibilidade WAI-ARIA no template do `CfpSubmissionComponent` (`aria-required`, `aria-invalid`, `aria-describedby`, `role="alert"`, `aria-live`) e vincular o bloqueio do botão de envio ao computed Signal de validade (`[disabled]` e `[attr.aria-disabled]`)
- [x] 3.4 Configurar rota ou navegação para o `CfpSubmissionComponent` no frontend e verificar compilação com `nx build frontend`
- [x] 3.5 Criar testes unitários com Jest para o `CfpSubmissionComponent`, validando explicitamente o estado inicial limpo dos Signals e o bloqueio do botão de envio no carregamento, e verificar execução com `nx test frontend`

## 4. Validação de Integração e Qualidade Final

- [ ] 4.1 Executar a suíte de testes unitários do workspace com `nx run-many -t test` e verificar aprovação completa em `api` e `frontend`
- [ ] 4.2 Executar verificação de lint em todo o repositório com `nx run-many -t lint` e garantir conformidade de código
