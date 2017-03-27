const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  title: {type: String, required: true},
  users: [{
    userId: {type:String, required: true},
    images: [{
      imageTitle: {type: String, required: true},
      imageUrl: {type:String, required:true},
      stats: {
        upvotes: Number,
        downvotes: Number
      },
      isFeatured: Boolean
    }]
  }]
})

const Category = mongoose.model('Category', categorySchema)

module.exports = {Category}
