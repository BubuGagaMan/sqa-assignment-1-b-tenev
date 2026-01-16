/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable<void>;
  }
}

Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    
    // 1. Request directly to Backend (Port 4000)
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/login',
      body: { username, password },
      failOnStatusCode: false // Prevent crash on 401/404 so we can debug
    }).then((response) => {
      
      // DEBUG: Log the entire response to the Cypress Console
      // (Open DevTools in the Cypress browser to see this)
      console.log('Login Response:', response);

      if (response.status !== 200) {
        throw new Error(`Login failed with status ${response.status}: ${JSON.stringify(response.body)}`);
      }

      const { body } = response;

      // 2. Safety Check: Ensure data structure is correct
      if (!body.data || !body.data.accessToken) {
        throw new Error(`Invalid response structure. Received: ${JSON.stringify(body)}`);
      }

      const token = body.data.accessToken;

      // 3. Inject into Frontend LocalStorage
      window.localStorage.setItem('token', token);
    });

  }, {
    validate() {
       cy.wrap(localStorage.getItem('token')).should('exist');
    },
    cacheAcrossSpecs: true
  });
});