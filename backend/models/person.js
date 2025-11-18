const mongoose = require('mongoose')
const winston = require('../loggers/logger')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })
  .then(() => {
    winston.info('Connected to MongoDB')
  })
  .catch(error => {
    winston.error(`Error connecting to MongoDB', ${error.message}`)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    minLength: [3, 'Must be at least 3 digit, got `{VALUE}`']
  },
  number: {
    type: String,
    required: [true, 'number is required'],
    validate: {
      validator: function(v) {
        if(v.length < 8) {
          return false
        }

        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

