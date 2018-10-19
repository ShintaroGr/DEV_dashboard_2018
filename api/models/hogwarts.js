const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HogwartsSchema = new Schema({
  type: {
    type: String,
    default: 'Hogwarts'
  },
  city: {
    type: String,
    default: '',
    enum: ['', 'run', 'bru', 'tir', 'bar', 'tls', 'stg', 'ren', 'par', 'nce', 'nan', 'ncy',
      'mpl', 'mar', 'lyn', 'bdx', 'lil']
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

HogwartsSchema
  .set('toObject', { getters: true })

HogwartsSchema.virtual('api_url').get(function () {
  return 'https://hogwarts.epitest.eu/ajax/' + this.city
})

module.exports = mongoose.model('Hogwarts', HogwartsSchema)
