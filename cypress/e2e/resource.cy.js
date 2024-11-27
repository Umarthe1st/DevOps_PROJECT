describe("Reservation Frontend", () => {
  let baseUrl;

  before(() => {
    // Set up before the tests
    cy.task("startServer").then((url) => {
      baseUrl = url; // Store the base URL
      cy.visit(baseUrl);
    });
  });

  after(() => {
    // Clean up after the tests
    return cy.task("stopServer");
  });

  describe("Reservation System", () => {
    const baseUrl = "http://localhost:5050"; // Update to your application's base URL
    
    it("should view all reservations", () => {
      // Visit the reservations list page
      cy.visit(`${baseUrl}/index.html`);
  
      // Ensure that the reservation we just added is visible in the table
    });
  });
  it('should update an existing resource', () => {
    cy.visit(baseUrl);
    // Click the edit button for the resource
    cy.get('button.btn-warning').filter(':contains("Edit")').last().click();
    // Update resource details
    cy.get('#editName').clear().type('Updated Name', { force: true });
    cy.get('#editLocation').clear().type('Updated Location', { force: true });
    cy.get('#editDate').clear().type('2024-12-01', { force: true });
    cy.get('#editTime').clear().type('18:30', { force: true });
    cy.get('#editGuests').clear().type('8', { force: true });
    cy.get('#editContact').clear().type('updatedcontact@example.com', { force: true });
    // Click the update resource button
    cy.get('#updateButton').click();
    // Retry to find the updated content
    cy.get('#tableContent', { timeout: 10000 }).should('contain', 'Updated Name');
  });

  it('should delete a reservation', () => {
    cy.visit(baseUrl);
    cy.get('button.btn-danger').filter(':contains("Delete")').last().click();
    // Verify that the resource has been deleted
    cy.get('#tableContent').contains('Updated Reservation').should('not.exist');
    });

  it('should display an error if any field is empty', () => {
    cy.visit(baseUrl);
    cy.get('button.btn-warning').filter(':contains("Edit")').last().click();
    cy.get('#editName').clear();
    cy.get('#editLocation').clear();
    cy.get('#editGuests').clear();
    cy.get('#editContact').clear();
    cy.get('#updateButton').click();
    cy.get('#editMessage').should('contain', 'All fields are required!')
                          .and('have.class', 'text-danger');
  });

  it('should display an error if the contact number is less than 8 characters', () => {
    cy.visit(baseUrl);
    cy.get('button.btn-warning').filter(':contains("Edit")').last().click();
    cy.get('#editContact').clear().type('12345', { force: true }); // Invalid contact number
    cy.get('#updateButton').click();
    cy.get('#editMessage').should('contain', 'Contact number must be at least 8 digits!')
                          .and('have.class', 'text-danger');
});
});




 


     

    // it('should delete a resource', () => {
    //   // Visit the base URL
    //   cy.visit(baseUrl);

    //   // Click the delete button for the last resource
    //   cy.get('button.btn-danger')
    //     .filter(':contains("Delete")')
    //     .last()
    //     .click();

    //   // Verify that the resource has been deleted
    //   cy.get('#tableContent').contains('Updated Resource').should('not.exist');
    // });


