const mongoose = require('mongoose');
const Schema = mongoose.Schema
const StatsSchema = require('./stats')
const { ObjectId } = Schema.Types

var imageSchema = new Schema({
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
  isFeatured: Boolean
});

const Image = mongoose.model('Image', imageSchema)

module.exports = {Image}
