const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const categorySchema = new Schema({
  title: {type: String, required: true},
  users: [{
    type: ObjectId,
    ref: 'user'
  }],
  images: [{
    type: ObjectId,
    ref: 'image'
  }]
})

categorySchema.pre('remove', function (next) {
  const Image = mongoose.model('image')
  const User = mongoose.model('user')

  const imagePromise = Image.remove({ _id: { $in: this.images } })
  const userPromise = User.remove({ _id: { $in: this.users } })

  Promise.all([imagePromise, userPromise])
  .then(() => next())
  .catch(err => console.error(err))
})
const Category = mongoose.model('category', categorySchema)

module.exports = Category
