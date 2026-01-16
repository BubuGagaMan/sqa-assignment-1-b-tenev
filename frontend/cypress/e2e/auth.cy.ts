// cypress/e2e/auth.cy.ts
describe('Authentication Flow', () => {
    // random string for a new user every time
  const randomId = Math.floor(Math.random() * 100000);
  const newUser = {
    username: `testuser${randomId}`,
    email: `test${randomId}@example.com`,
    password: 'password123'
  };

  it('should allow a user to register', () => {
    cy.visit('/register');
    cy.get('input[name="username"]').type(newUser.username);
    cy.get('input[name="email"]').type(newUser.email);
    cy.get('input[name="password"]').type(newUser.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/login');
  });

  it('should allow the new user to login', () => {
    cy.visit('/login');

    cy.get('input[type="text"]').type(newUser.username);
    cy.get('input[type="password"]').type(newUser.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/profile', { timeout: 10000 });

    cy.contains(newUser.username).should('be.visible');
  });
});