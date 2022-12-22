describe("smoke tests", () => {
  it("should return valid price data", () => {
    const testData = 'Fullerite-C72\t16778\nFullerite-C50\t19612'

    cy.visitAndCheck('/');
    cy.get('#items').type(testData)
    cy.findByRole("button", { name: /Submit/i }).click();

    cy.wait(5000)

    cy.get('#value').contains('ISK')
  });

  it("should not return any price data due to bad inputs with no quantities", () => {
    const testData = 'eggs\ntoast\nbeans'

    cy.visitAndCheck('/');
    cy.get('#items').type(testData)
    cy.findByRole("button", { name: /Submit/i }).click();

    cy.wait(5000)

    cy.get('#value').contains('Waiting for valid')
  });

  it("should not return any price data due to proper format but invalid items", () => {
    const testData = 'Full\t17\nTest\t777'

    cy.visitAndCheck('/');
    cy.get('#items').type(testData)
    cy.findByRole("button", { name: /Submit/i }).click();

    cy.wait(5000)

    cy.get('#value').contains('Waiting for valid')
  });

  it("should not return any price data due to mixed format but invalid items", () => {
    const testData = 'Full\nTest\t777'

    cy.visitAndCheck('/');
    cy.get('#items').type(testData)
    cy.findByRole("button", { name: /Submit/i }).click();

    cy.wait(5000)

    cy.get('#value').contains('Waiting for valid')
  });

  it("should return price data for single valid item mixed in with invalid items", () => {
    const testData = 'Full\nTest\t777\nFullerite-C50\t1961'

    cy.visitAndCheck('/');
    cy.get('#items').type(testData)
    cy.findByRole("button", { name: /Submit/i }).click();

    cy.wait(5000)

    cy.get('#value').contains('ISK')
  });
});