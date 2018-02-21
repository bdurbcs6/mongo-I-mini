const express = require('express');
const helmet = require('helmet');
const cors = require('cors'); // https://www.npmjs.com/package/cors
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Bear = require('./Bears/BearModel');

const server = express();

server.use(helmet()); // https://helmetjs.github.io/
server.use(cors());   // https://medium.com/trisfera/using-cors-in-express-cac7e29b005b
server.use(bodyParser.json());

server.get('/', function(req, res) {
  res.status(200).json({ status: 'API Running' });
});

server.post('/api/bears',(req, res) => {
  const bearInformation = req.body;
  if (req.body.species && req.body.latinName) {
  const bear = new Bear(bearInformation);
  bear
    .save()
    .then((savedBear) => {
      res.status(201).json(savedBear);
    })
    .catch((error) => {
      res.status(500).json({ error: 'There was an error while saving the Bear to the Database' })
    });
  } else {
    res.status(400).json({ error: 'Must provide Species and Latin Name'})
  };
});

server.get('/api/bears', (req, res) => {
  Bear.find({})
    .then((bears) => {
      res.status(200).json(bears);
  })
  .catch((error) => {
    res.status(500)
    res.json({ error: 'The information could not be retrieved.' });
  });
});

server.get('/api/bears/:id', (req, res) => {
  const id =req.params.id;
  Bear.findById(id)
    .then((bear) => {
      if(bear) {
        res.status(200).json(bears);
      } else {
        res.status(404).json({ message: 'Not Found'});
      }
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res
        .status(400)
        .json({ message: `the ID: ${error.value} is not valid` });
    } else {
      res.status(500).json({
        message: 'The bear information could not be retrieved'
      });
    }
  });
});

server.delete('/api/bears/:id', (req, res) => {
  const id =req.params.id;

  Bear.findByIdAndRemove(id)
    .then((bear) => {
      res.status(200).json(bears);
  })
  .catch((error) => {
    res.status(500)
    res.json({ error: 'The bear information could not be retrieved.' });
  });
});


server.put('/api/bears/:id',(req, res) => {
  const { species, latinName } = req.body;
  const { id } = req.params.id;

  if (species && latinName) {
    Bear.findByIdAndUpdate(id, req.body)
      .then((updatedBear) => {
        if (updatedBear) {
          res.status(201).json(updatedBear);
        } else {
          res
            .status(404)
            .json({ error: `The bear with ID: ${id} does not exist`});
        }
     })
      .catch((error) => {
        res.status(500).json({ error: 'There was an error while saving the Bear to the Database' })
      });
    } else {
      res.status(500).json({ error: 'Must provide Species and Latin Name'})
  };
});



mongoose
  .connect('mongodb://localhost/BearKeeper')
  .then(db => {
    console.log(`Successfully connected to the ${db.connections[0].name} database`);
  })
  .catch(error => {
    console.error('Database Connection Failed');
  });

const port = process.env.PORT || 5005;
server.listen(port, () => {
  console.log(`API running on http://localhost:${port}.`);
});
