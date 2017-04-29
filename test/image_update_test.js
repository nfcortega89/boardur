const Image = require('../server/models/image')
const Category = require('../server/models/category')
const User = require('../server/models/user')

describe('Updating image', () => {
  let image
  let category
  let user

  beforeEach((done) => {
    category = new Category({ title: 'girls' })
    user = new User({ instagramId: 'bonitaaaaapplebum', category: category._id })
    image = new Image({ title: 'by the beach' })
    image.category = category._id
    image.user = user._id
    category.save()
    .then(() => user.save())
    .then(() => image.save())
    .then(() => done())
    .catch(err => done(err))
  })

  function assertName (operation, done) {
    operation
      .then(image => Image.find({}))
      .then(image => {
        image.length.should.equal(1)
        image[0].title.should.equal('tattoos')
        done()
      })
      .catch(err => done(err))
  }

  it('model instance set n save', (done) => {
    image.set('title', 'tattoos')
    assertName(image.save(), done)
  })

  it('model instance update', (done) => {
    image.update({ title: 'tattoos' })
    assertName(image.update({ title: 'tattoos' }), done)
  })
})
