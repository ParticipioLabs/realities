describe('Test basic functionality', () => {
  it('Create an org and a need', () => {
    const userEmail = 'realitiestester@example.com';
    const userPass = 'password123';

    cy
      .visit('localhost:3001')
      .contains('Pick an organization')
      .root()
      .contains('Login')
      //.click()
  })
})
  