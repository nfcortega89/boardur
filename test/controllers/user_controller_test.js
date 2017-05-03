const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const { app } = require('../../server/')
const Category = require('../../server/models/category')
const User = require('../../server/models/user')
chai.should()
chai.use(chaiHttp)

describe('The users controller', () => {
  let category
  let user
  let userTwo

  beforeEach((done) => {
    category = new Category({ title: 'guns' })
    user = new User({ instagramId: 'nikkotoonaughty' })
    userTwo = new User({ instagramId: 'arthurtoohotty' })
    user.category = category._id
    userTwo.category = category._id
    Promise.all([category.save(), user.save(), userTwo.save()])
      .then(() => done())
      .catch(err => done(err))
  })
  it('handles a POST request to /api/users', (done) => {
    User.count().then(count => {
      chai.request(app)
        .post('/api/users')
        .send({ instagramId: 'bonitaaaaapplebum', category: category._id })
        .end((err, res) => {
          if (err) { return done(err) }

          User.count()
            .then(newCount => {
              newCount.should.equal(count + 1)
              done()
            })
            .catch(err => done(err))
        })
    })
  })
  it('handles a PUT request to /api/users/:id', (done) => {
    chai.request(app)
      .put(`/api/users/${user._id}`)
      .send({ instagramId: 'bonitaaaaapplebum', id: user._id })
      .end((err, res) => {
        if (err) { return done(err) }
        User.findById(user._id)
          .then(updatedUser => {
            updatedUser.instagramId.should.equal('bonitaaaaapplebum')
            done()
          })
      })
  })
  it('handles a DELETE request to /api/users/:id', (done) => {
    chai.request(app)
      .delete(`/api/users/${user._id}`)
      .send({ id: user._id })
      .end((err, res) => {
        if (err) { return done(err) }
        User.findById(user._id)
          .then(deletedUser => {
            /* eslint-disable no-unused-expressions */
            expect(deletedUser).to.be.null
            done()
          })
      })
  })
  it('handles a GET request to fetch all resources to /api/users', (done) => {
    chai.request(app)
      .get('/api/users')
      .end((err, res) => {
        if (err) { return done(err) }
        res.body.users.length.should.equal(2)
        done()
      })
  })
  it('handles a GET request to fetch a specific resources to /api/users/:id', (done) => {
    chai.request(app)
      .get(`/api/users/${userTwo._id}`)
      .end((err, res) => {
        if (err) { return done(err) }
        res.body.user.instagramId.should.equal('arthurtoohotty')
        done()
      })
  })
})
