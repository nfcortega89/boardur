const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('../models/user')
mongoose.Promise = global.Promise

router.use(bodyParser.json())

/** GET **/

router.get('/', (req, res) => {
  User.find({})
  .then(users => {
    res.json({users})
  })
  .catch(err => {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  })
})

router.get('/:id', (req, res) => {
  User.findById(req.params.id)
  .populate('images')
  .then(user => res.json({user}))
  .catch(err => {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  })
})

/** POST **/

router.post('/auth', (req, res) => {
  const requiredFields = ['uid']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]

    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  User.findOne({uid : req.body.uid})
    .then(user => {
      if (!user) {
        const newUser = new User({
          uid: req.body.uid,
          admin: false
        })
        newUser.save()
          .then(user => res.status(201).json(user)).catch(err => {
            console.error(err)
            res.status(500).json({message: 'Internal server error', Error: err})
          })
      } else {res.json(user)}
    })
})

/** DELETE **/

router.delete('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`)
    console.error(message)
    return res.status(400).json({message: message})
  }
  User.findById(req.params.id)
  .then(user => user.remove())
  .then(() => res.status(204).end())
  .catch(err => {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
  })
})
module.exports = router
