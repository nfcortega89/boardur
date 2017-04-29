require('chai').should()
const expect = require('chai').expect
const Category = require('../server/models/category')
const Image = require('../server/models/image')
const User = require('../server/models/user')

/* eslint-disable no-unused-expressions */

describe('Deleting categories', () => {
  let girls
  let image
  let user

  beforeEach((done) => {
    girls = new Category({ title: 'girls' })
    user = new User({ instagramId: 'bonitaaaaapplebum' })
    image = new Image({ title: 'Alison' })
    user.category = girls._id
    image.category = girls._id
    image.user = user._id

    girls.save()
      .then(() => user.save())
      .then(() => image.save())
      .then(() => done())
      .catch(err => done(err))
  })
  it('should remove a category', (done) => {
    girls.remove()
      .then(() => Category.findById(girls._id))
      .then(category => {
        expect(category).to.be.null
        done()
      })
      .catch(error => done(error))
  })
  it('should remove all associated users and images', (done) => {
    Category.findById(girls._id)
      .then((category) => category.remove())
      .then(() => User.findById(user._id))
      .then((savedUser) => {
        Image.findById(image._id)
          .then((savedImage) => {
            expect(savedUser).to.be.null
            expect(savedImage).to.be.null
            done()
          })
          .catch(err => done(err))
      })
      .catch(err => done(err))
  })
})
