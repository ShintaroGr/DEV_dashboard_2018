const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExampleSchema = new Schema({
  type: {
    type: String,
    default: 'Example'
  },
  refresh: {
    type: Number,
    default: 300
  },
  position: {
    type: Number,
    default: 0
  }
})

ExampleSchema
  .set('toObject', { getters: true })

ExampleSchema.virtual('api_url').get(function () {
  return 'https://example.example/api/'
})

module.exports = mongoose.model('Example', ExampleSchema)
