const express = require('express')
const categoryRouter = require('./api/categories')
const userRouter = require('./api/users')
const imageRouter = require('./api/images')
const mongoose = require('mongoose')
const {PORT, DATABASE_URL} = require('./config')

const app = express()
app.use('/categories', categoryRouter)
app.use('/users', userRouter)
app.use('/images', imageRouter)

let server

// this function connects to our database, then starts the server
function runServer (databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err)
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`)
        resolve()
      })
      .on('error', err => {
        mongoose.disconnect()
        reject(err)
      })
    })
  })
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer () {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server')
      server.close(err => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  })
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err))
};

module.exports = {app, runServer, closeServer}
