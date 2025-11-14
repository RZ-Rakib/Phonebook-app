const express = require('express');
const mongoose = require('mongoose')
const winston = require('./loggers/logger');
const morgan = require('morgan');
const Person = require('./models/person')
require('dotenv').config()

const app = express();

// middlewares
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/persons', (req, res, next) => {
  Person
  .find({})
  .then( result => {
    res.json(result);
  })
  .catch(error => next(error))
});

app.get('/info', (req, res, next) => {
  Person
    .countDocuments({})
    .then(count => {
      const date = new Date();

      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `);

      winston.info(`'GET /info' fetched info successfully`);
    })
    .catch(error => {
      winston.error(`'GET /info' Failed to fetch info, ${error.message}`);
      next(error);
    });
});

  
  app.get('/api/persons/:id', (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        winston.warn(`'GET /api/persons/:id' - ID is missing`);
        return res.status(400).json({ error: 'invalid id' });
      }
      const person = contacts.find((n) => n.id === id);
      if (person) {
        res.json(person);
        winston.info(`'GET api/persons/:id' - person with ID ${id} found`);
      } else {
        winston.warn(`'GET api/person/:id' -  id ${id} is invalid`);
        res.status(404).end();
      }
    } catch (error) {
      winston.error(
        `'GET api/persons/:ID' - Failed to fetch data from server, ${error.message}`
      );
      res.status(500).end();
    }
  });
  
  app.delete('/api/persons/:id', (req, res) => {
      const id = req.params.id;
      if (!id) {
        winston.warn(`'DELETE' api/persons/:id - ID is missing`);
        return res.status(400).json({ error: 'ID missing' });
      }
      
      Person.findByIdAndDelete(id)
        .then(person => {
          res.status(204).end();
          winston.info(`'DELETE' api/persons/:id - person with ID ${id} deleted`);
        })
        .catch(error => next(error))
  });
  
  app.post('/api/persons', (req, res) => {
      const { name, number } = req.body;

      if (!name || !number) {
        winston.warn(`'POST api/persons/' - Missing required fields`);
        return res.status(400).json({ error: 'Missing name or number' });
      }
      
      Person.findOne({name: name.trim()})
        .then(existingPerson => {
          if (existingPerson) {
            winston.warn(`'POST api/persons/' - name:${name} must be unique`);
            res.status(400).json({ error: 'name must be unique' });
            return null
          }
          const person = new Person({
            name: name.trim(),
            number: number.trim(),
          });
          return person.save()
        })
        .then(savedPerson => {
          if(savedPerson){
            winston.info(`'POST api/persons' - name:${name} is created sucessfully`);
            res.status(201).json(savedPerson);
          }
        })
        .catch(error => next(error))
  })

  const unknownEndPoint = (req,res) => {
    winston.warn(`Unknown endpoint`)
    res.status(404).json({error: 'Unknown endpoint'})
  }
  app.use(unknownEndPoint)

  const errorHandler = (error, request, response, next) => {
  winston.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  