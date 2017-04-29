const mongoose = require('mongoose')
mongoose.Promise = global.Promise

before((done) => {
  mongoose.connect('mongodb://localhost/trendr_test')
  mongoose.connection
    .once('open', () => { done() })
    .on('error', (error) => {
      console.warn('Warning', error)
    })
})

beforeEach((done) => {
  const { collections } = mongoose.connection
  const collectionKeys = Object.keys(collections)
  let counter = 0

  function check () {
    counter += 1
    if (counter === collectionKeys.length) {
      done()
    }
  }

  collectionKeys.forEach((collection) => {
    mongoose.connection.db.dropCollection(collection, (err, result) => {
      // if (err) { console.log(err) }
      check()
    })
  })
})
