const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const router = express.Router()
const Category = require('../models/category')

mongoose.Promise = global.Promise

router.use(bodyParser.json())

/** GET **/

router.get('/', (req, res) => {
  Category.find({})
  .then(categories => {
    res.json({categories})
  })
  .catch(err => {
    console.error(err)
    res.status(500).json({message: 'Internal server error'})
  })
})

router.get('/:id', (req, res) => {
  Category.findById(req.params.id)
  .then(category => {
    res.json({category})
  })
  .catch(err => {
    console.error(err)
    res.status(500).json({message: 'Internal server error'})
  })
})

/** POST **/

router.post('/', (req, res) => {
  const requiredFields = ['title']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]

    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  Category
  .create({
    title: req.body.title
  })
  .then(category => res.status(201).json({category}))
  .catch(err => {
    console.error(err)
    res.status(500).json({message: 'Internal server error'})
  })
})

/** PUT **/

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`)
    console.error(message)
    return res.status(400).json({message: message})
  }
  const toUpdate = {}
  const updateableFields = ['title']
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field]
    }
  })
  Category
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .then(category => res.status(201).json(category))
  .catch(err => {
    console.error(err)
    res.status(500).json({message: 'Internal server error'})
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
  Category
    .findById(req.params.id)
    .then(category => category.remove())
    .then(() => res.status(204).end())
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Internal server error'})
    })
})

module.exports = router
