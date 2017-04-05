const mongoose = require('mongoose');
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

var userSchema = mongoose.Schema({
  //_id: Object(a79yd87h2r87h847y23h),
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
