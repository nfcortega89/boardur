require('chai').should()
const Category = require('../server/models/category')

describe('Reading category', () => {
  let categoryOne
  let categoryTwo

  beforeEach((done) => {
    categoryOne = new Category({ title: 'category1' })
    categoryTwo = new Category({ title: 'category2' })

    Promise.all([categoryOne.save(), categoryTwo.save()])
    .then(() => done())
    .catch(err => done(err))
  })

  it('should get all categories', (done) => {
    Category.find({})
      .then((categories) => {
        categories.length.should.equal(2)
        done()
      })
      .catch(err => done(err))
  })
  it('should get one category by id', (done) => {
    Category.findById(categoryOne._id)
      .then((category) => {
        category.title.should.equal('category1')
        done()
      })
      .catch(err => done(err))
  })
})
