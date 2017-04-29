require('chai').should()

const User = require('../server/models/user')
const Category = require('../server/models/category')

describe('Creating user', () => {
  let user
  let category

  beforeEach((done) => {
    category = new Category({ title: 'girls' })
    user = new User({ instagramId: 'bonitaaaaapplebum' })
    user.category = category._id

    category.save()
      .then(() => user.save())
      .then(() => done())
      .catch(err => done(err))
  })

  it('saves a user', (done) => {
    user.isNew.should.equal(false)
    done()
  })
  it('adds user to corresponding category', (done) => {
    Category.findById(category._id)
      .then(category => {
        category.users[0].toString().should.equal(user._id.toString())
        done()
      })
      .catch(err => done(err))
  })
})
