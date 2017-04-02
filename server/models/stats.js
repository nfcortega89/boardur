const mongoose = require('mongoose');
const Schema = mongoose.Schema
const { ObjectId } = Schema.Types

const StatsSchema = new Schema({
  upvotes: [{
    type: ObjectId,
    ref: 'user'
  }],
  downvotes: [{
    type: ObjectId,
    ref: 'user'
  }]
})
module.exports = {StatsSchema}
