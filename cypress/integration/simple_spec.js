describe('Test basic functionality', () => {
  it('Create an org and a need', () => {
    const userEmail = 'realitiestester@example.com';
    const userPass = 'password123';

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
  })
})
  