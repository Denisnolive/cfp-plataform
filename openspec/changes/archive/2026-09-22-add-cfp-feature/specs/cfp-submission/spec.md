# Spec Delta

## Purpose

Permite que palestrantes submetam propostas de palestras (Call for Papers) com validação robusta de dados e interface acessível e reativa baseada em Angular Signals.

## ADDED Requirements

### Requirement: O sistema deve permitir a submissão de propostas de palestras válidas
O sistema SHALL fornecer um endpoint `POST /api/cfp` que recebe dados de palestrantes compatíveis com o contrato `SpeakerDTO`, valida todas as informações e retorna a submissão criada com status HTTP 201 Created.

#### Scenario: Submissão bem-sucedida de proposta de palestra
- **WHEN** o cliente envia uma requisição `POST /api/cfp` com payload válido contendo `name`, `email`, `talkTitle` e `isGDE`
- **THEN** o sistema SHALL responder com status 201 Created e o objeto da proposta cadastrada contendo um identificador único `id`

### Requirement: O sistema deve rejeitar payloads com dados inválidos ou ausentes
O backend SHALL validar rigorosamente os campos obrigatórios e seus formatos através de `class-validator` e rejeitar qualquer payload com erros de validação retornando status HTTP 400 Bad Request.

#### Scenario: Rejeição de e-mail inválido
- **WHEN** o cliente envia um payload contendo um valor inválido para o campo `email`
- **THEN** o sistema SHALL responder com status 400 Bad Request e detalhar a mensagem de erro de validação correspondente

#### Scenario: Rejeição de campos obrigatórios vazios
- **WHEN** o cliente envia um payload com `name` ou `talkTitle` vazio ou ausente
- **THEN** o sistema SHALL responder com status 400 Bad Request indicando a obrigatoriedade dos campos

### Requirement: O sistema deve rejeitar campos não previstos no contrato
O backend SHALL aplicar verificação estrita de whitelist no `ValidationPipe`, descartando ou recusando qualquer requisição que contenha atributos não mapeados.

#### Scenario: Envio de propriedades adicionais não mapeadas
- **WHEN** o cliente envia um payload contendo propriedades extras não definidas no DTO
- **THEN** o sistema SHALL rejeitar a requisição com status 400 Bad Request

### Requirement: O formulário frontend deve gerenciar estado exclusivamente via Angular Signals
A interface de submissão no Angular 21 SHALL utilizar Signals (`signal` e `computed`) para controlar o estado dos campos, a validade do formulário e os estados de carregamento e feedback.

#### Scenario: Estado inicial e bloqueio do botão de envio
- **WHEN** o componente de submissão é inicializado
- **THEN** o Signal de estado do formulário SHALL refletir campos vazios/padrão e o botão de submissão SHALL estar desabilitado (`disabled` e `aria-disabled="true"`)

#### Scenario: Habilitação do botão após preenchimento válido
- **WHEN** todos os campos obrigatórios forem preenchidos com valores válidos atualizando os Signals
- **THEN** o Signal de validade SHALL ser computado como verdadeiro e o botão de envio SHALL se tornar ativo

### Requirement: O formulário deve garantir acessibilidade WAI-ARIA
O componente de submissão SHALL seguir os padrões WAI-ARIA, associando rótulos, descrições de erro e estados semânticos aos controles de entrada.

#### Scenario: Comunicação acessível de erros de validação
- **WHEN** um campo do formulário é considerado inválido após interação
- **THEN** o elemento de entrada SHALL possuir `aria-invalid="true"` e referenciar a mensagem de erro via `aria-describedby`

#### Scenario: Notificação de feedback acessível
- **WHEN** o processo de submissão é concluído com sucesso ou falha
- **THEN** o sistema SHALL apresentar a mensagem de status em uma região acessível com `role="alert"` ou `aria-live="polite"`
