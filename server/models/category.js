const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const categorySchema = new Schema({
  title: {type: String, required: true},
  images: [{
    type: ObjectId,
    ref: 'image'
  }]
})

categorySchema.pre('remove', function (next) {
  const Image = mongoose.model('image')
  const imagePromise = Image.remove({ _id: { $in: this.images } })

  Promise.all([imagePromise])
  .then(() => next())
  .catch(err => console.error(err))
})
const Category = mongoose.model('category', categorySchema)

module.exports = Category
