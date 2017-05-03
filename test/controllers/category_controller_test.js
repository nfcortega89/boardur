const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const { app } = require('../../server/')
const Category = require('../../server/models/category')
chai.should()
chai.use(chaiHttp)

describe('The categories controller', () => {
  it('handles a POST request to /api/categories', (done) => {
    Category.count().then(count => {
      chai.request(app)
        .post('/api/categories')
        .send({ title: 'girls' })
        .end((err, res) => {
          if (err) { return done(err) }

          Category.count()
            .then(newCount => {
              newCount.should.equal(count + 1)
              done()
            })
            .catch(err => done(err))
        })
    })
  })
  it('handles a PUT request to /api/categories/:id', (done) => {
    Category.create({ title: 'girls' }).then(category => {
      chai.request(app)
        .put(`/api/categories/${category._id}`)
        .send({ title: 'tattoos', id: category._id })
        .end((err, res) => {
          if (err) { return done(err) }

          Category.findById(category._id)
            .then(updatedCategory => {
              updatedCategory.title.should.equal('tattoos')
              done()
            })
            .catch(err => done(err))
        })
    })
  })
  it('handles a DELETE request to /api/categories/:id', (done) => {
    Category.create({ title: 'girls' }).then(category => {
      chai.request(app)
        .delete(`/api/categories/${category._id}`)
        .send({ id: category._id })
        .end((err, res) => {
          if (err) { return done(err) }

          Category.findById(category._id)
            .then(deletedCategory => {
              /* eslint-disable no-unused-expressions */
              expect(deletedCategory).to.be.null
              done()
            })
            .catch(err => done(err))
        })
    })
  })
  it('handles a GET request to fetch all resources to /api/categories', (done) => {
    const girls = new Category({ title: 'girls' })
    const tattoos = new Category({ title: 'tattoos' })
    Promise.all([girls.save(), tattoos.save()])
      .then(categories => {
        chai.request(app)
          .get('/api/categories')
          .end((err, res) => {
            if (err) { return done(err) }
            res.body.categories.length.should.equal(2)
            done()
          })
      })
      .catch(err => done(err))
  })
  it('handles a GET request to fetch a specific resources to /api/categories/:id', (done) => {
    const girls = new Category({ title: 'girls' })
    const tattoos = new Category({ title: 'tattoos' })
    Promise.all([girls.save(), tattoos.save()])
      .then(categories => {
        chai.request(app)
          .get(`/api/categories/${girls._id}`)
          .end((err, res) => {
            if (err) { return done(err) }
            res.body.category.title.should.equal('girls')
            done()
          })
      })
      .catch(err => done(err))
  })
})
