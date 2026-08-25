const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('✅ Connected to MongoDB')
  })
  .catch((error) => {
    console.error(' Error connecting to MongoDB:', error.message)
  })

const phoneRegex = /^\d{2,3}-\d+$/

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required'],
  },
  number: {
    type: String,
    minLength: [8, 'Phone number must be at least 8 digits'],
    validate: {
      validator: function(v) {
        return phoneRegex.test(v)
      },
      message: props => `${props.value} is not a valid phone number! Must be XX-XXXX... or XXX-XXXX...`
    },
    required: [true, 'Phone number is required'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
