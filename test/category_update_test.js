const Category = require('../server/models/category')

describe('Updating category', () => {
  let category

  beforeEach((done) => {
    category = new Category({ title: 'girls' })
    category.save()
      .then(() => done())
      .catch(err => done(err))
  })

  function assertName (operation, done) {
    operation
      .then(category => Category.find({}))
      .then(category => {
        category.length.should.equal(1)
        category[0].title.should.equal('tattoos')
        done()
      })
      .catch(err => done(err))
  }

  it('model instance set n save', (done) => {
    category.set('title', 'tattoos')
    assertName(category.save(), done)
  })

  it('model instance update', (done) => {
    category.update({ title: 'tattoos' })
    assertName(category.update({ title: 'tattoos' }), done)
  })
})
