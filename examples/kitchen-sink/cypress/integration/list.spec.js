context('Actions', () => {
  beforeEach(() => {
    cy.visit('/pages')
  })

  // https://on.cypress.io/interacting-with-elements

  it('should display a list of pages', () => {
    cy.get('[data-cy="list"]')
      .should(($list) => {
        expect($list.children()).to.have.length(10)
      })
  })
})