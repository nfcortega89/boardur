const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('../models/user')
const Image = require('../models/image')
const Category = require('../models/category')
const fetchInstagram = require('../utils/fetchInstagram')

mongoose.Promise = global.Promise

router.use(bodyParser.json())

/** GET **/

router.get('/', (req, res) => {
  function findImages(query = {}) {
    Image.find(query)
    .sort({ "score" : -1 })
    .then(images => res.json({images}))
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: 'Internal server error' })
    })
  }
  function findFeatured(query = {}) {
    console.log('find featured', query)
    Image.find(query)
    .sort({ "score" : -1 })
    .limit(1)
    .then(images => res.json(images[0]))
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: 'Internal server error' })
    })
  }
  if (req.query.fetch_top) {
    Category.findOne({title: req.query.category_id})
      .then(category => {
        findFeatured({ category: category._id })
      })
  } else if (req.query.category_id) {
    Category.findOne({title: req.query.category_id})
      .then(category => {
        findImages({ category: category._id })
      })
  } else {
    findImages()
  }
})

/** GET BY ID **/
router.get('/:id', (req, res) => {
  Image.findById(req.params.id)
  .then(image => { res.json({image}) })
  .catch(err => {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  })
})

/** POST **/

router.post('/post-instagram', (req, res) => {
  const requiredFields = ['instagramId', 'category']
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      res.status(400).send(`'api/images/post-instagram' missing required '${field}' field`)
    }
  })
  fetchInstagram(req.body.instagramId)
    .then(images => {
      return images.map((image) => {
        return new Image({
          title: image.title,
          url: image.url,
          category: req.body.category,
        }).save()
      })
    })
    .then(imagePromises => {
      return Promise.all(imagePromises)
    })
    .then(savedImages => {
      res.status(201).send(`saved ${savedImages.length} images`)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

router.post('/upvote', (req, res) => {
  console.log(req.body)
  const requiredFields = ['userId', 'imageId']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]

    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  Image
    .findByIdAndUpdate(req.body.imageId, {
      $addToSet: { upvotes: req.body.userId },
      $unset: { downvotes: req.body.userId }
    }, { new: true })
    .then(image => res.status(200).json(image))
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Internal server error'})
    })
})
router.post('/downvote', (req, res) => {
  const requiredFields = ['userId', 'imageId']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]

    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  Image
    .findByIdAndUpdate(req.body.imageId,
      {
        $addToSet: { downvotes: req.body.userId } ,
        $unset: { upvotes: req.body.userId } ,
      }, { new: true })
    .then(image => res.status(200).json(image))
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
    res.status(400).json({message: message})
  }
  Image.findById(req.params.id)
  .then(image => image.remove())
  .then(() => res.status(204).end())
  .catch(err => {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  })
})

module.exports = router
