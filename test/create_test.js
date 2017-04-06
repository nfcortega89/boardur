const should = require('chai').should()
const User = require('../server/models/user')

describe('Creating user', () => {
  it('saves a user', (done) => {
    const nikko = new User({ instagramId: 'Nikko'})

    nikko.save()
      .then(() => {
        nikko.isNew.should.equal(false)
        done()
      })
  })
})
