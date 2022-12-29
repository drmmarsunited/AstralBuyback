describe("smoke tests", () => {
  it("should return valid price data", () => {
    const testData = 'Fullerite-C72\t16778\nFullerite-C50\t19612'

    cy.visitAndCheck('/');
    cy.get('#items').type(testData)
    cy.findByRole("button", { name: /Submit/i }).click();

    cy.wait(5000)

    cy.get('#value').contains('ISK')
  });

  it("should return valid price data with some items missing order data from Jita", () => {
    const testData = 'Augumene\t71\nBitumens\t73'

    cy.visitAndCheck('/');
    cy.get('#items').type(testData)
    cy.findByRole("button", { name: /Submit/i }).click();

    cy.wait(5000)

    cy.get('#value').contains('ISK')
  });

  it("should return valid price data with spaces instead of tabs", () => {
    const testData = 'Fullerite-C72 16778\nFullerite-C50 19612'

    cy.visitAndCheck('/');
    cy.get('#items').type(testData)
    cy.findByRole("button", { name: /Submit/i }).click();

    cy.wait(5000)

    cy.get('#value').contains('ISK')
  });

  it("should return valid price data for multi-word items", () => {
    const testData = 'Concussion Bomb\t5\nCap Booster 100\t93'

    cy.visitAndCheck('/');
    cy.get('#items').type(testData)
    cy.findByRole("button", { name: /Submit/i }).click();

    cy.wait(5000)

    cy.get('#value').contains('ISK')
  });

  it("should return valid price data with spaces instead of tabs for multi-word items", () => {
    const testData = 'Concussion Bomb 5\nCap Booster 100 93'

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