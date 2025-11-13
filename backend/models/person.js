const mongoose = require('mongoose')
const winston = require('../loggers/logger')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url, {family: 4})
  .then(result => {
    winston.info('Connected to MongoDB');
  })
  .catch(error => {
    winston.error(`Error connecting to MongoDB', ${error.message}`);
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

