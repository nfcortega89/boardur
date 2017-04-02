const mongoose = require('mongoose');
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

var imageSchema = new Schema({
  imageTitle: String,
  imageUrl: String,
  user: {
    type: ObjectId,
    ref: 'user'
  },
  category: {
    type: ObjectId,
    ref: 'category'
  },
  stats: {
    type: ObjectId,
    ref: 'stats'
  },
  isFeatured: Boolean
});

const Image = mongoose.model('Image', imageSchema)

module.exports = {Image}
