/// <reference types="cypress" />

describe('Consent', () => {
  it('index', () => {
    cy.getCookie('_consent').should('not.exist')

    cy.visit('/')
    cy.get('.CookieConsent', { timeout: 30000 }).contains(
      'We use cookies on our website. Some are technically necessary, others help us improve your user experience.'
    )
    cy.get('#rcc-confirm-button').click()
    cy.getCookie('_consent').should('have.property', 'value', 'true')
    cy.get('.navbar-brand', { timeout: 30000 }).contains('DataCite Commons')
  })

  it('works', () => {
    cy.getCookie('_consent').should('not.exist')

    cy.visit('/doi.org')
    cy.get('.CookieConsent', { timeout: 30000 }).contains(
      'We use cookies on our website. Some are technically necessary, others help us improve your user experience.'
    )
    cy.get('#rcc-confirm-button').click()
    cy.getCookie('_consent').should('have.property', 'value', 'true')
    cy.get('.navbar-brand', { timeout: 30000 }).contains('DataCite Commons')
  })

  it('people', () => {
    cy.getCookie('_consent').should('not.exist')

    cy.visit('/orcid.org')
    cy.get('.CookieConsent', { timeout: 30000 }).contains(
      'We use cookies on our website. Some are technically necessary, others help us improve your user experience.'
    )
    cy.get('#rcc-confirm-button').click()
    cy.getCookie('_consent').should('have.property', 'value', 'true')
    cy.get('.navbar-brand', { timeout: 30000 }).contains('DataCite Commons')
  })

  it('organizations', () => {
    cy.getCookie('_consent').should('not.exist')

    cy.visit('/ror.org')
    cy.get('.CookieConsent', { timeout: 30000 }).contains(
      'We use cookies on our website. Some are technically necessary, others help us improve your user experience.'
    )
    cy.get('#rcc-confirm-button').click()
    cy.getCookie('_consent').should('have.property', 'value', 'true')
    cy.get('.navbar-brand', { timeout: 30000 }).contains('DataCite Commons')
  })
})

export {}