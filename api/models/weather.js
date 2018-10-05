const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WeatherSchema = new Schema({
  type: {
    type: String,
    default: 'Weather'
  },
  api_url: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  refresh: {
    type: Number,
    default: 300
  }
})

module.exports = mongoose.model('Weather', WeatherSchema)
