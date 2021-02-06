import crypto from "crypto";

function randomString() {
  return crypto.randomBytes(10).toString('hex');
}

describe('Test basic functionality', () => {
  it('Create an org and a need', () => {
    const userEmail = 'realitiestester@example.com';
    const userPass = 'password123';
    const orgName = randomString();
    const orgSlug = randomString();
    const needName = randomString();

    cy
      .visit('localhost:3001')
      .contains('Pick an organization')
      .root()
      .contains('Login')
      .click()

      // login page on keycloak
      // see comment in cypress.json about how this is against best practices
      // TODO: handle cases where user is already logged in
      // should be enough to click logout if already logged in
      .get('#username')
      .type(userEmail)
      .get('#password')
      .type(userPass)
      .get('#kc-form-login')
      .submit()
      .root()
      // waiting to get back to the homepage
      .contains('Pick an organization')

      .get('[data-cy=create-org-plus-btn]')
      .click()
      .get('[data-cy=create-org-orgname-input]')
      .type(orgName)
      .get('[data-cy=create-org-orgslug-input]')
      .type(orgSlug)
      .root()
      .contains('Create')
      .click()

      .get('[data-cy=needs-container] [data-cy=list-header-plus-btn]')
      .click()
      .get('[data-cy=needs-container] [data-cy=list-form-name-input]')
      .type(needName)
      .get('[data-cy=needs-container] [data-cy=list-form')
      .submit()

      .get('[data-cy=detail-view]')
      .contains('Need')
      .get('[data-cy=detail-view]')
      .contains(needName)
  })
})
  