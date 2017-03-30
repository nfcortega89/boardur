const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Category} = require('./models');

const app = express();
app.use(bodyParser.json());
// app.use(morgan('common'))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/categories', (req, res) => {
  Category.find({})
  .exec()
  .then(categories => {
    res.json({categories})
  })
  .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
})

app.get('/categories/:id', (req, res) => {
  Category.findById(req.params.id)
  .exec()
  .then(category => {
    res.json({category})
  })
  .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
})

app.post('/categories', (req, res) => {
  console.log(req.body)
  const requiredFields = ['title']
  for(let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];

    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const toUpdate = {};
  Category
  .create({
    title: req.body.title,
    users: []
  })
  .then(
    category => res.status(201).json({category})
  )
  .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

app.put('/categories/:id', (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
      console.error(message);
      res.status(400).json({message: message});
  }
  const toUpdate = {};
  const updateableFields = ['title', 'user']
  updateableFields.forEach(field => {
    if(field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  Category
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .exec()
  .then(caterogory => res.status(204).end())
  .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

app.delete('/categories/:id', (req, res) => {
  Category
  .findByIdAndRemove(req.params.id)
  .exec()
  .then(category => res.status(204).end())
  .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
})

// catch-all endpoint if client makes request to non-existent endpoint
// app.use('*', function(req, res) {
//   res.status(404).json({message: 'Not Found'});
// });

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
