const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

var UserSchema = mongoose.Schema({
  uid: String,
  admin: { type: Boolean, default: false }
})

const User = mongoose.model('user', UserSchema)

module.exports = User
