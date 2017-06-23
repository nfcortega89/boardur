require('chai').should()
const Image = require('../server/models/image')
const Category = require('../server/models/category')
const User = require('../server/models/user')

describe('Reading images', () => {
  let imageOne
  let imageTwo
  let category
  let user

  beforeEach((done) => {
    category = new Category({ title: 'girls' })
    user = new User({ instagramId: 'bonitaaaaapplebum' })
    imageOne = new Image({ title: 'image1' })
    imageTwo = new Image({ title: 'image2' })
    imageOne.category = category._id
    imageOne.user = user._id
    imageTwo.category = category._id
    imageTwo.user = user._id
    user.category = category._id
    category.save()
      .then(() => user.save())
      .then(() => Promise.all([imageOne.save(), imageTwo.save()]))
      .then(() => done())
      .catch(err => done(err))
  })

  it('should get all images', (done) => {
    Image.find({})
      .then((images) => {
        images.length.should.equal(2)
        done()
      })
      .catch(err => done(err))
  })
  it('should get one image by id', (done) => {
    Image.findById(imageOne._id)
      .then((image) => {
        image.title.should.equal('image1')
        done()
      })
      .catch(err => done(err))
  })
  it('should fetch all images by category', (done) => {
    Image.find({ category })
      .then((images) => {
        images.length.should.be.gt(0)
        done()
      })
      .catch(err => done(err))
  })
})
