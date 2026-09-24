describe('Cadastro de Eventos (/event/new)', () => {
  const eventUrl = '/event/new';

  beforeEach(() => {
    // Interceptação simulada da API de eventos para isolamento e determinismo
    cy.intercept('POST', '**/api/events*', {
      statusCode: 201,
      body: {
        id: 'event-1',
        name: 'Workshop de Testes E2E',
        address: 'Av. Paulista, 1000 - São Paulo, SP',
        capacity: 100,
        date: '2026-12-10',
      },
    }).as('createEvent');

    // Navega até a rota /event/new
    cy.visit(eventUrl);
  });

  it('deve cadastrar um evento com sucesso ao preencher todos os campos obrigatórios', () => {
    // Preenchimento dos campos usando seletores CSS convencionais (id, name ou class)
    cy.get('input[name="name"], #name, .event-name')
      .first()
      .clear()
      .type('Workshop de Testes E2E');

    cy.get('input[name="address"], #address, .event-address')
      .first()
      .clear()
      .type('Av. Paulista, 1000 - São Paulo, SP');

    cy.get('input[name="capacity"], #capacity, .event-capacity')
      .first()
      .clear()
      .type('100');

    cy.get('input[name="date"], #date, .event-date')
      .first()
      .clear()
      .type('2026-12-10');

    // Clica no botão de submeter usando seletores CSS convencionais
    cy.get('button[type="submit"], #btn-submit, .btn-submit')
      .first()
      .click();

    // Verifica se a submissão ocorreu com sucesso usando asserções tradicionais do Cypress
    cy.contains(/sucesso|cadastrado com sucesso|criado com sucesso/i).should('be.visible');
  });

  it('deve exibir mensagens de erro nativas ao submeter formulário vazio', () => {
    // Submete o formulário imediatamente sem preencher os campos obrigatórios
    cy.get('button[type="submit"], #btn-submit, .btn-submit')
      .first()
      .click();

    // Asserções para verificar que as mensagens de erro nativas de validação aparecem na tela
    cy.get('.error-message, .error-text, [role="alert"], :invalid')
      .should('be.visible');

    // Validação da exibição de erros associados aos campos obrigatórios
    cy.get('#name-error, .error-name, [data-error="name"], .error-text')
      .should('be.visible');

    cy.get('#address-error, .error-address, [data-error="address"], .error-text')
      .should('be.visible');

    cy.get('#capacity-error, .error-capacity, [data-error="capacity"], .error-text')
      .should('be.visible');

    cy.get('#date-error, .error-date, [data-error="date"], .error-text')
      .should('be.visible');
  });
});
