require('chai').should()

const Category = require('../server/models/category')

describe('Creating category', () => {
  it('saves a category', (done) => {
    const category = new Category({
      title: 'girls'
    })
    category.save()
      .then(() => {
        category.isNew.should.equal(false)
        done()
      })
      .catch(err => done(err))
  })
})
