const mongoose = require('mongoose');
const ImageSchema = require('./image')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const categorySchema = new Schema({
  title: {type: String, required: true},
  users: [{
    type: ObjectId,
    ref: 'user'
  }]
})

const Category = mongoose.model('Category', categorySchema)

module.exports = {Category}
