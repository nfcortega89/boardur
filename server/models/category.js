const mongoose = require('mongoose');
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

const Category = mongoose.model('category', categorySchema)

module.exports = {Category}
