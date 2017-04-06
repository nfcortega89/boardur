const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router()
const {Category} = require('../models/category');
const {User} = require('../models/user');
const {Image} = require('../models/image');

mongoose.Promise = global.Promise;

router.use(bodyParser.json());

/** GET **/

router.get('/', (req, res) => {
  User.find({})
  .then(users => {
    res.json(users)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error'})
  });
})

router.get('/:id', (req, res) => {
  User.findById(req.params.id)
  .populate('images')
  .then(user => res.json({user}))
  .catch(err => {
    console.error(err);
      res.status(500).json({ message: 'Internal server error'})
  });
})

router.get('/images/:id', (req, res) => {
  Image.findById(req.params.id)
  .then(image => {res.json({image})})
  .catch(err => {
    console.error(err);
      res.status(500).json({ message: 'Internal server error'})
  });
})
/** POST **/

router.post('/', (req, res) => {
  const requiredFields = ['instagramId', 'category']
  for(let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];

    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  newUser = new User({
    instagramId: req.body.instagramId,
    images: [],
    category: req.body.category
  })
  newUser.save() //see middleware
    .then(user => res.status(201).json(user))
    .catch(err => {
       console.error(err);
       res.status(500).json({message: 'Internal server error', Error: err});
     });
});

/** IMAGE POST **/

router.post('/images', (req,res) => {
  const requiredFields = ['userId', 'title', 'url']
  for(let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];

    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  // find user using userId
  User.findById(req.body.userId)
    .then(user => {
      newImage = new Image({
        title: req.body.title,
        url: req.body.url,
        user: user._id,
        category: user.category,
        stats: {
          upvotes: [],
          downvotes: []
        },
        isFeatured: false
      })
      return newImage.save()
    })
    .then((image) => {
      res.status(201).json(image)
    })
    .catch(err => {
      res.status(400).json({message: 'Image failed to save', Error: err})
    });

});

/** PUT **/

router.put('/:id', (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).json({message: message});
  }
  const toUpdate = {};
  const updateableFields = ['userId', 'category']
  updateableFields.forEach(field => {
    if(field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  User
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .then(user => res.status(201).json(user))
  .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

/** DELETE **/

router.delete('/:id', (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).json({message: message});
  }
  User.findByIdAndRemove(req.params.id) // go to middleware
  .then(() => res.status(204).end())
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error'});
  });
})



module.exports = router
