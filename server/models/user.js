const mongoose = require('mongoose');
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

var UserSchema = mongoose.Schema({
  instagramId: String,
  category: {
    type: ObjectId,
    ref: 'category'
  },
  images: [{
    type: ObjectId,
    ref: 'image'
  }]
});

UserSchema.pre('save', function(next) {
  const Category = mongoose.model('category')
  Category.findByIdAndUpdate(this.category, { $push: { users: this._id } })
  .then(() => next())
  .catch(err => console.error(err))
})

UserSchema.pre('remove', function(next) {
  const Image = mongoose.model('image')
  const Category = mongoose.model('category')

  const imagePromise = Image.findByIdAndRemove(this.image)
  const categoryPromise = Category.findByIdAndRemove(this.category)

  Promise.all([imagePromise, categoryPromise])
  .then(() => next())
  .catch(err => console.error(err))
})

const User = mongoose.model('user', UserSchema)

module.exports = {User}
