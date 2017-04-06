const mongoose = require('mongoose');
const Schema = mongoose.Schema
const StatsSchema = require('./stats')
const { ObjectId } = Schema.Types

var ImageSchema = new Schema({
  title: String,
  url: String,
  user: {
    type: ObjectId,
    ref: 'user'
  },
  category: {
    type: ObjectId,
    ref: 'category'
  },
  stats: StatsSchema,
  isFeatured: Boolean,
  createdAt: Date
});

ImageSchema.pre('save', function(next) {
  this.createdAt = Date.now()

  const User = mongoose.model('user')
  const Category = mongoose.model('category')

  const userPromise = User.findByIdAndUpdate(this.user, { $push: { images: this._id }})
  const categoryPromise = Category.findByIdAndUpdate(this.category, { $push: { images: this._id }})

  Promise.all([userPromise, categoryPromise])
    .then(() => next())
    .catch(err => console.error(err))
})

ImageSchema.pre('remove', function(next) {
  const User = mongoose.model('user')
  const Category = mongoose.model('category')

  const userPromise = User.findByIdAndRemove(this.user)
  const categoryPromise = Category.findByIdAndRemove(this.category)

  Promise.all([userPromise, categoryPromise])
  .then(() => next())
  .catch(err => console.error(err))
})

const Image = mongoose.model('image', ImageSchema)

module.exports = {Image}
