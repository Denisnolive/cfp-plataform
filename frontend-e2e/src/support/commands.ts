/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-explicit-any */
/// <reference types="cypress" />

// ***********************************************
// Custom commands para suporte a AI-Driven Testing
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Executa passos de teste baseados em linguagem natural (AI-Driven Testing)
       * @example cy.prompt('Type "Auditório Oracle" in the event name field')
       * @example cy.prompt(['Type "500" in the capacity field', 'Click the button that submits or saves the event'])
       */
      prompt(prompts: string | string[]): Chainable<Subject>;

      /**
       * Alias com tolerância a typos para cy.prompt
       */
      promt(prompts: string | string[]): Chainable<Subject>;
    }
  }
}

function handleAiPrompt(prompts: string | string[]) {
  const instructions = Array.isArray(prompts) ? prompts : [prompts];

  instructions.forEach((instruction) => {
    cy.log(`🤖 **[AI Prompt]**: ${instruction}`);

    // 1. Ação de Preenchimento: Type "valor" in/into the <campo>
    const typeMatch = instruction.match(/type\s+["']([^"']+)["']\s+(?:in|into)\s+(?:the\s+)?(.+)/i);
    if (typeMatch) {
      const value = typeMatch[1];
      const target = typeMatch[2].toLowerCase();

      let selector = '';
      if (target.includes('name') || target.includes('nome')) {
        selector = 'input[name="name"], #name, .event-name, #speaker-name, input[placeholder*="nome" i]';
      } else if (target.includes('address') || target.includes('endereço') || target.includes('endereco')) {
        selector = 'input[name="address"], #address, .event-address, input[placeholder*="endereço" i]';
      } else if (target.includes('capacity') || target.includes('capacidade')) {
        selector = 'input[name="capacity"], #capacity, .event-capacity, input[type="number"]';
      } else if (target.includes('date') || target.includes('data')) {
        selector = 'input[name="date"], #date, .event-date, input[type="date"]';
      } else if (target.includes('email') || target.includes('e-mail')) {
        selector = 'input[name="email"], #email, #speaker-email, input[type="email"]';
      } else if (target.includes('title') || target.includes('título') || target.includes('titulo')) {
        selector = 'input[name="talkTitle"], input[name="title"], #speaker-talk-title';
      } else {
        const cleaned = target.replace(/field|campo|input/gi, '').trim();
        selector = `input[name*="${cleaned}"], input[id*="${cleaned}"], textarea[name*="${cleaned}"]`;
      }

      cy.get(selector).first().clear().type(value);
      return;
    }

    // 2. Ação de Clique: Click the button that <ação> ou Click <alvo>
    const clickMatch = instruction.match(/click\s+(?:the\s+)?(.+)/i);
    if (clickMatch) {
      const target = clickMatch[1].toLowerCase();
      if (
        target.includes('submit') ||
        target.includes('save') ||
        target.includes('salvar') ||
        target.includes('enviar') ||
        target.includes('cadastrar')
      ) {
        cy.get('button[type="submit"], #btn-submit, .btn-submit, button')
          .filter(':visible')
          .first()
          .click();
      } else {
        const cleanedTarget = target
          .replace(/button|botão|link/gi, '')
          .replace(/["']/g, '')
          .trim();
        if (cleanedTarget) {
          cy.contains(new RegExp(cleanedTarget, 'i')).click();
        } else {
          cy.get('button').filter(':visible').first().click();
        }
      }
      return;
    }

    // 3. Ação de Validação: Verify that <asserção>
    const verifyMatch = instruction.match(/verify\s+(?:that\s+)?(.+)/i);
    if (verifyMatch) {
      const assertion = verifyMatch[1].toLowerCase();
      if (assertion.includes('success') || assertion.includes('sucesso')) {
        cy.contains(/sucesso|cadastrado com sucesso|criado com sucesso|success/i, { timeout: 10000 })
          .should('be.visible');
      } else if (assertion.includes('error') || assertion.includes('erro')) {
        cy.get('.error-message, .error-text, [role="alert"], :invalid')
          .should('be.visible');
      } else {
        const textToFind = assertion
          .replace(/is visible|está visível|visible/gi, '')
          .replace(/["']/g, '')
          .trim();
        if (textToFind) {
          cy.contains(new RegExp(textToFind, 'i'), { timeout: 10000 }).should('be.visible');
        }
      }
      return;
    }

    cy.log(`⚠️ Prompt não mapeado automaticamente: ${instruction}`);
  });
}

// Como 'prompt' já é um comando interno do Cypress, utilizamos Cypress.Commands.overwrite
Cypress.Commands.overwrite('prompt', (originalFn, prompts: string | string[]) => {
  handleAiPrompt(prompts);
});

// Alias com tolerância a erros de digitação
Cypress.Commands.add('promt', (prompts: string | string[]) => {
  handleAiPrompt(prompts);
});

export {};
