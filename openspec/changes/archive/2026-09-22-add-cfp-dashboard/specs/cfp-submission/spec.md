# Spec Delta

## ADDED Requirements

### Requirement: O formulário de submissão deve fornecer navegação para o Dashboard
A tela do formulário de submissão de CFP SHALL fornecer um elemento de navegação (botão ou link estilizado) que permita ao usuário transitar para a visualização do Dashboard, mantendo o mesmo padrão visual e coerência com os Design Tokens do formulário.

#### Scenario: Transição do formulário para o Dashboard
- **WHEN** o usuário aciona o botão de navegação para o Dashboard na tela de submissão
- **THEN** a aplicação SHALL navegar para a rota `/dashboard`
