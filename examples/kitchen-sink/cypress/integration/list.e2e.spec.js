context('List', () => {
  beforeEach(() => {
  })

  // https://on.cypress.io/interacting-with-elements

  it('should display a list of pages', () => {

    cy.visit('/pages')
    cy.get('[data-testid="list"]')
      .children()
      .as('list')
      .should('have.length', 10)
  })

  it('should navigate to the detail page when a list item is clicked', () => {

    cy.get('[data-testid="list"]')
      .children()
      .first()
      .as('item')

    cy.get('@item')
      .find('[data-testid="title"]')
      .invoke('text')
      .as('listItemTitle')

    cy.get('@item')
      .find('[data-testid="subtext"]')
      .invoke('text')
      .as('listItemSubtext')

    cy.get('@item').click()

    cy.get('input[data-nodepath="page/0/title"]').should('exist')
    cy.get('input[data-nodepath="page/0/title"]')
      .invoke('val')
      .then((val) => {
        cy.get('@listItemTitle').should('equal', val)
      })

    cy.get('input[data-nodepath="page/0/metadata"]').should('exist')
    cy.get('input[data-nodepath="page/0/metadata"]')
      .invoke('val')
      .then((val) => {
        cy.get('@listItemSubtext').should('equal', val)
      })

  })

})