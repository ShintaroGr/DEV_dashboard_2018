const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HogwartsSchema = new Schema({
  type: {
    type: String,
    default: 'Hogwarts'
  },
  city: {
    type: String,
    required: true,
    enum: ['lil', 'par']
  },
  refresh: {
    type: Number,
    default: 300
  }
})

HogwartsSchema
  .set('toObject', { getters: true })

HogwartsSchema.virtual('api_url').get(function () {
  return 'https://hogwarts.epitest.eu/ajax/' + this.city
})

module.exports = mongoose.model('Hogwarts', HogwartsSchema)
