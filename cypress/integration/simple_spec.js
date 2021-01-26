describe('Test basic functionality', () => {
  it('Create an org and a need', () => {
    cy
      .visit('localhost:3001')
      .contains('Pick an organization')
  })
})
  