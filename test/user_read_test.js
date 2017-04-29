require('chai').should()
const User = require('../server/models/user')
const Category = require('../server/models/category')

describe('Reading user', () => {
  let userOne
  let userTwo
  let category

  beforeEach((done) => {
    category = new Category({ title: 'girls' })
    userOne = new User({ instagramId: 'user1', category: category._id })
    userTwo = new User({ instagramId: 'user2', category: category._id })

    Promise.all([userOne.save(), userTwo.save(), category.save()])
    .then(() => done())
    .catch(err => done(err))
  })

  it('should get all user', (done) => {
    User.find({})
      .then((users) => {
        users.length.should.be.gt(1)
        done()
      })
      .catch(err => done(err))
  })
  it('should get one user by id', (done) => {
    User.findById(userOne._id)
      .then((user) => {
        user.instagramId.should.equal('user1')
        done()
      })
      .catch(err => done(err))
  })
})
