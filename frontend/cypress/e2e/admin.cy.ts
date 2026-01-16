import users from '../fixtures/users.json';

describe('Admin Panel', () => {
  
  context('When logged in as Admin', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('input[type="text"]').type(users.admin.username);
      cy.get('input[type="password"]').type(users.admin.password);
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/profile', { timeout: 10000 });

      cy.visit('/admin/users');
    });

    it('should show the user table', () => {
      cy.contains('User Management (Admin)').should('be.visible');

      cy.contains(users.user1.username).should('be.visible');
    });

    it('should be able to delete a user', () => {
        const targetUser = users.user2.username;


        cy.contains(targetUser).should('exist');

        // find the row containing user2 and click Delete
        cy.contains('tr', targetUser).within(() => {
            cy.contains('Delete').click();
        });

        cy.on('window:confirm', () => true);

        cy.contains(targetUser).should('not.exist');
    });
  });

  context('When logged in as Regular User', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('input[type="text"]').type(users.user1.username);
      cy.get('input[type="password"]').type(users.user1.password);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/profile', { timeout: 10000 });
    });

    it('should redirect away from admin page', () => {
      cy.visit('/admin/users');
      
      cy.url().should('not.include', '/admin/users');
    });
  });
});