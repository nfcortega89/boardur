const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const ImageSchema = new Schema({
  title: String,
  url: String,
  category: {
    type: ObjectId,
    ref: 'category',
    required: true
  },
  upvotes: [{
    type: ObjectId,
    ref: 'user'
  }],
  downvotes: [{
    type: ObjectId,
    ref: 'user'
  }],
  createdAt: Date,
  score: {
    type: Number,
    default: 0
  }
})

ImageSchema.pre('save', function (next) {
  this.createdAt = Date.now()

  const Category = mongoose.model('category')
  const categoryPromise = Category.findByIdAndUpdate(this.category, { $push: { images: this._id } })

  Promise.all([categoryPromise])
    .then(() => next())
    .catch(err => console.error(err))
})

ImageSchema.pre('remove', function (next) {
  const Category = mongoose.model('category')
  const categoryPromise = Category.findByIdAndUpdate(this.category, { $pull: { images: this._id } })

  Promise.all([categoryPromise])
  .then(() => next())
  .catch(err => console.error(err))
})

const Image = mongoose.model('image', ImageSchema)

module.exports = Image
