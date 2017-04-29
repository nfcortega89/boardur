const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

var UserSchema = mongoose.Schema({
  instagramId: String,
  category: {
    type: ObjectId,
    ref: 'category',
    required: true
  },
  images: [{
    type: ObjectId,
    ref: 'image'
  }]
})

UserSchema.pre('save', function (next) {
  const Category = mongoose.model('category')
  Category.findByIdAndUpdate(this.category, { $push: { users: this._id } })
  .then(() => next())
  .catch(err => console.error(err))
})

UserSchema.pre('remove', function (next) {
  const Image = mongoose.model('image')
  const Category = mongoose.model('category')

  const imagePromise = Image.remove({ _id: { $in: this.images } })
  const categoryPromise = Category.findByIdAndUpdate(this.category, { $pull: { users: this._id } })

  Promise.all([imagePromise, categoryPromise])
  .then(() => next())
  .catch(err => console.error(err))
})

const User = mongoose.model('user', UserSchema)

module.exports = User
