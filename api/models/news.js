const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NewsSchema = new Schema({
  type: {
    type: String,
    default: 'News'
  },
  keyword: {
    type: String
  },
  refresh: {
    type: Number,
    default: 300
  }
}, { getters: true })

NewsSchema.virtual('api_url').get(function () {
  if (this.keyword) {
    return 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + this.keyword + '&api-key=edc9b00ebc8e40b7b6337ec33fb0ba18'
  } else {
    return 'https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=edc9b00ebc8e40b7b6337ec33fb0ba18'
  }
})

module.exports = mongoose.model('News', NewsSchema)
