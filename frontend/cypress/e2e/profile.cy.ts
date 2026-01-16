// cypress/e2e/profile.cy.ts
import users from '../fixtures/users.json';

describe('User Profile', () => {
  beforeEach(() => {

    cy.visit('/login');


    cy.get('input[type="text"]').type(users.user1.username);
    cy.get('input[type="password"]').type(users.user1.password);
    

    cy.get('button[type="submit"]').click();


    // the frontend redirects to /profile automatically on success
    cy.url().should('include', '/profile', { timeout: 10000 });
  });

  it('should display user details correctly', () => {
    // check that the data loaded
    cy.contains(users.user1.username).should('be.visible');
    cy.get('input[name="email"]').should('have.value', users.user1.email);
  });

  it('should update the email address', () => {
    const newEmail = `updated${Date.now()}@email.com`;

    // clear and type new email
    cy.get('input[name="email"]').clear().type(newEmail);
    cy.contains('Save Changes').click();

    cy.contains('Profile updated successfully!').should('be.visible');
    
    cy.reload();
    cy.get('input[name="email"]').should('have.value', newEmail);
  });
});