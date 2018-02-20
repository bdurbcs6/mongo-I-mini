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

server.post('/api/bears', (req, res) => {
  const bearInformation = req.body;
  const bear = new Bear(bearInformation);
  bear.save()
    .then((savedBear) => {
      res.status(201).json(savedBear);
    }).catch((error) => {
      res.status(500).json({ error: 'There was an error while saving the Bear to the Database' })
    });
});

mongoose
  .connect('mongodb://localhost/BearKeeper')
  .then(db => {
    console.log(9`Successfully connected to the ${db.connections[0].name} database`);
  })
  .catch(error => {
    console.error('Databse Connection Failed');
  });

const port = process.env.PORT || 5005;
server.listen(port, () => {
  console.log(`API running on http://localhost:${port}.`);
});
