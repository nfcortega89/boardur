const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router()
const {Category} = require('../models/category');
const {User} = require('../models/user');

mongoose.Promise = global.Promise;

router.use(bodyParser.json());

/** GET **/



/** POST **/

router.post('/', (req, res) => {
  console.log(req.body)
  const requiredFields = ['userId', 'category']
  for(let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];

    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  let newUser
  let categoryToUpdate
  Category
    .findOne({ title: req.body.category })
    .then(category => {
      categoryToUpdate = category
      newUser = new User({
        userId: req.body.userId,
        images: []
      })
      newUser.category = category
      return newUser.save()
    })
    .then(user => Category.findById(categoryToUpdate._id))
    .then(category => {
      category.users.push(newUser)
      return category.save()
    })
    .then(category => res.status(201).json(category))
    .catch(err => {
       console.error(err);
       res.status(500).json({message: 'Internal server error', Error: err});
     });
});

/** PUT **/


/** DELETE **/

module.exports = router
