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

  
  app.get('/api/persons/:id', (req, res, next) => {
      const id = req.params.id;

      Person.findById(id)
      .then(person => {
        if (!person) {
          winston.info(`'GET api/persons/:id' - person with ID ${id} not found`);
          return res.status(404).json({error: 'No person found with this ID'})
        }
        winston.info(`'GET api/persons/:id' - person with ID ${id} found`);
        res.json(person);
        })
        .catch(error => next(error))
  });
  
  app.delete('/api/persons/:id', (req, res, next) => {
      const id = req.params.id;
      
      Person.findByIdAndDelete(id)
        .then(person => {
          res.status(204).end();
          winston.info(`'DELETE' api/persons/:id - person with ID ${id} deleted`);
        })
        .catch(error => next(error))
  });

  app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const {number} = req.body

    Person.findById(id)
      .then(person => {
        if(!person) {
          winston.warn(`'PUT api/persons/:id' - person with id${id} not found `)
          return res.status(404).json({error: `person with id${id} not found`})
        }

        person.number = number

        return person.save().then(returnedPerson => {
          winston.info(`'PUT api/persons/:id' - The number has sucessfully changed for ${returnedPerson.name}`)
          res.status(200).json(returnedPerson)
        })
      })
      .catch(error => next(error))
  })
  
  app.post('/api/persons', (req, res, next) => {
      const { name, number } = req.body;

      if (!name || !number) {
        winston.warn(`'POST api/persons' - Missing required fields`);
        return res.status(400).json({ error: 'Missing name or number' });
      }
      
      Person.findOne({name: name.trim()})
        .then(existingPerson => {
          if (existingPerson) {
            winston.warn(`'POST api/persons/' - name:${name} must be unique`);
            return res.status(400).json({ error: 'name must be unique' });
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
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  }
  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  