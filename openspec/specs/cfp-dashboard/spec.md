# cfp-dashboard Specification

## Purpose

Permite que organizadores e palestrantes visualizem todas as propostas de palestras submetidas na plataforma através de uma interface web reativa, organizada e semanticamente acessível.

## Requirements

### Requirement: O sistema deve disponibilizar endpoint para recuperação de todas as propostas de palestras
O backend SHALL fornecer um endpoint `GET /api/cfp` que retorna um array de objetos em conformidade com o contrato `SpeakerDTO` com status HTTP 200 OK.

#### Scenario: Recuperação bem-sucedida de propostas cadastradas
- **WHEN** uma requisição `GET /api/cfp` é enviada ao backend
- **THEN** o sistema SHALL responder com status 200 OK contendo a lista de todas as propostas submetidas

#### Scenario: Recuperação quando não há propostas cadastradas
- **WHEN** uma requisição `GET /api/cfp` é enviada e nenhuma proposta foi submetida
- **THEN** o sistema SHALL responder com status 200 OK e um array vazio `[]`

### Requirement: O Dashboard frontend deve gerenciar o estado da lista via Angular Signals
O componente frontend `CfpDashboardComponent` SHALL gerenciar a coleção de propostas utilizando Signals reativos (`WritableSignal<SpeakerDTO[]>`), atualizando a interface automaticamente após o consumo do endpoint HTTP.

#### Scenario: Carregamento e renderização inicial de palestras
- **WHEN** o usuário acessa o Dashboard
- **THEN** o sistema SHALL disparar a requisição HTTP GET para a rota de propostas e atualizar o Signal com os dados recebidos, refletindo na interface

#### Scenario: Exibição de indicador de destaque para Google Developer Experts
- **WHEN** uma proposta possui o atributo `isGDE` como verdadeiro
- **THEN** a interface SHALL exibir uma identificação visual destacada indicando que o palestrante é um Google Developer Expert (GDE)

#### Scenario: Exibição de estado vazio informativo
- **WHEN** o Signal de propostas estiver vazio após o carregamento
- **THEN** a interface SHALL exibir uma mensagem informativa amigável indicando que ainda não existem palestras submetidas

### Requirement: A interface do Dashboard deve utilizar HTML semântico e manter consistência com Design Tokens
A interface do Dashboard SHALL ser construída com elementos semânticos (`<table>` com `<thead>`/`<tbody>` ou lista semântica `<ol>`/`<ul>` com `<article>`) e aplicar rigorosamente os mesmos tokens visuais (paleta de cores, tipografia, bordas arredondadas e sombras) utilizados no formulário de submissão.

#### Scenario: Estruturação acessível e semântica
- **WHEN** o Dashboard renderiza a listagem de palestras
- **THEN** a estrutura HTML SHALL utilizar marcação semântica com cabeçalhos e rótulos acessíveis permitindo leitura por tecnologias assistivas

### Requirement: Acesso e navegação para a rota do Dashboard
O sistema SHALL disponibilizar uma rota dedicada `path: 'dashboard'` que carrega o componente do Dashboard.

#### Scenario: Acesso direto à rota dashboard
- **WHEN** o usuário navega diretamente para `/dashboard`
- **THEN** a aplicação SHALL renderizar o componente `CfpDashboardComponent`
