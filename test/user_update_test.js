const User = require('../server/models/user')
const Category = require('../server/models/category')

describe('Updating user', () => {
  let user
  let category

  beforeEach((done) => {
    category = new Category({ title: 'girls' })
    user = new User({ instagramId: 'bonitaaaaapplebum', category: category._id })
    user.save()
      .then(() => { done() })
      .catch(err => done(err))
  })

  function assertName (operation, done) {
    operation
      .then(user => User.find({}))
      .then(users => {
        users.length.should.equal(1)
        users[0].instagramId.should.equal('nikkotoonaughty')
        done()
      })
      .catch(err => done(err))
  }

  it('model instance set n save', (done) => {
    user.set('instagramId', 'nikkotoonaughty')
    assertName(user.save(), done)
  })

  it('model instance update', (done) => {
    user.update({ instagramId: 'nikkotoonaughty' })
    assertName(user.update({ instagramId: 'nikkotoonaughty' }), done)
  })
})
