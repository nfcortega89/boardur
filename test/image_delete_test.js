require('chai').should()
const expect = require('chai').expect
const Category = require('../server/models/category')
const Image = require('../server/models/image')
const User = require('../server/models/user')

/* eslint-disable no-unused-expressions */

describe('Deleting image', () => {
  let category
  let image
  let user

  beforeEach((done) => {
    category = new Category({ title: 'category' })
    user = new User({ instagramId: 'bonitaaaaapplebum' })
    image = new Image({ title: 'Alison' })
    user.category = category._id
    image.category = category._id
    image.user = user._id

    category.save()
      .then(() => user.save())
      .then(() => image.save())
      .then(() => done())
      .catch(err => done(err))
  })
  it('should remove an image', (done) => {
    image.remove()
      .then(() => Image.findById(image._id))
      .then(savedImage => {
        expect(savedImage).to.be.null
        done()
      })
      .catch(error => done(error))
  })
  it('should remove itself from its category and user array', (done) => {
    Image.findById(image._id)
      .then((image) => image.remove())
      .then(() => Category.findById(category._id))
      .then((savedCategory) => {
        User.findById(user._id)
          .then((savedUser) => {
            savedCategory.images.length.should.equal(0)
            savedUser.images.length.should.equal(0)
            done()
          })
          .catch(error => done(error))
      })
      .catch(error => done(error))
  })
})
