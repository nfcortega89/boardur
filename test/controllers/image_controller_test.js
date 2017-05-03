const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const { app } = require('../../server/')
const Category = require('../../server/models/category')
const User = require('../../server/models/user')
const Image = require('../../server/models/image')
chai.should()
chai.use(chaiHttp)

describe('The images controller', () => {
  let category
  let user
  let userTwo
  let image

  beforeEach((done) => {
    category = new Category({ title: 'guns' })
    user = new User({ instagramId: 'nikkotoonaughty' })
    userTwo = new User({ instagramId: 'arthurtoohotty' })
    image = new Image({ title: 'this is awesome' })
    image.category = category._id
    image.user = user._id
    user.category = category._id
    userTwo.category = category._id
    Promise.all([category.save(), user.save(), userTwo.save(), image.save()])
      .then(() => done())
      .catch(err => done(err))
  })
  it('handles a POST request to /api/images', (done) => {
    Image.count().then(count => {
      chai.request(app)
        .post('/api/images')
        .send({ title: 'check this out', category: category._id, user: user._id, url: 'http://instagram.com' })
        .end((err, res) => {
          if (err) { return done(err) }

          Image.count()
            .then(newCount => {
              newCount.should.equal(count + 1)
              done()
            })
            .catch(err => done(err))
        })
    })
  })
  it('handles a PUT request to /api/images/:id', (done) => {
    chai.request(app)
      .put(`/api/images/${image._id}`)
      .send({ title: 'check this out!', id: image._id })
      .end((err, res) => {
        if (err) { return done(err) }
        Image.findById(image._id)
          .then(updatedImage => {
            updatedImage.title.should.equal('check this out!')
            done()
          })
      })
  })
  it('handles a DELETE request to /api/images/:id', (done) => {
    chai.request(app)
      .delete(`/api/images/${image._id}`)
      .send({ id: image._id })
      .end((err, res) => {
        if (err) { return done(err) }
        Image.findById(image._id)
          .then(deletedImage => {
            /* eslint-disable no-unused-expressions */
            expect(deletedImage).to.be.null
            done()
          })
      })
  })
  it('handles a GET request to fetch all resources to /api/images', (done) => {
    chai.request(app)
      .get('/api/images')
      .end((err, res) => {
        if (err) { return done(err) }
        res.body.images.length.should.equal(1)
        done()
      })
  })
  it('handles a GET request to fetch a specific resources to /api/image/:id', (done) => {
    chai.request(app)
      .get(`/api/images/${image._id}`)
      .end((err, res) => {
        if (err) { return done(err) }
        res.body.image.title.should.equal('this is awesome')
        done()
      })
  })
})
