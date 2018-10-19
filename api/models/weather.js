const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WeatherSchema = new Schema({
  type: {
    type: String,
    default: 'Weather'
  },
  city: {
    type: String,
    required: true
  },
  refresh: {
    type: Number,
    default: 300
  },
  position: {
    type: Number,
    default: 0
  }
}, { getters: true })

WeatherSchema.virtual('api_url').get(function () {
  return 'http://api.openweathermap.org/data/2.5/weather?q=' + this.city + '&APPID=e31be7fe3713edd678459b857975892b&units=metric'
})
module.exports = mongoose.model('Weather', WeatherSchema)
