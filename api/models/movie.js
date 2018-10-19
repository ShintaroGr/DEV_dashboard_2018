const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
  type: {
    type: String,
    default: 'Movie'
  },
  sort: {
    type: String,
    default: 'now_playing',
    enum: ['now_playing', 'upcoming'],
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
})

MovieSchema
  .set('toObject', { getters: true })

MovieSchema.virtual('api_url').get(function () {
  return 'https://api.themoviedb.org/3/movie/' + this.sort + '?api_key=29ea9d98e4f3efee25247afe15877a8b&region=FR&language=fr-FR'
})

module.exports = mongoose.model('Movie', MovieSchema)
