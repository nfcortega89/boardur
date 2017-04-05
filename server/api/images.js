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
  Image.find({})
  .then(images => {
    res.json(images)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error'});
  });
})

/** GET BY ID **/


/** DELETE **/
router.delete('/:id', (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
      console.error(message);
      res.status(400).json({message: message});
  }
  Image.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).end())
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error'});
  });
})


module.exports = router
