require('chai').should()

const Image = require('../server/models/image')
const User = require('../server/models/user')
const Category = require('../server/models/category')

describe('Creating image', () => {
  let category
  let user
  beforeEach((done) => {
    category = new Category({ title: 'girls' })
    user = new User({ instagramId: 'bonitaaaaapplebum' })
    user.category = category._id
    category.save()
      .then(() => user.save())
      .then(() => done())
      .catch(err => done(err))
  })
  it('saves a image', (done) => {
    const image = new Image({ title: 'by the beach' })
    image.category = category._id
    image.user = user._id
    image.save()
      .then(() => {
        image.isNew.should.equal(false)
        done()
      })
      .catch(err => done(err))
  })
})
