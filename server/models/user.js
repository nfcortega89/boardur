const mongoose = require('mongoose');
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

var userSchema = mongoose.Schema({
  userId: String,
  category: {
    type: ObjectId,
    ref: 'category'
  },
  images: [{
    type: ObjectId,
    ref: 'image'
  }]
});

const User = mongoose.model('User', userSchema)

module.exports = {User}
