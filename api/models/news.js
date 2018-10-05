const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NewsSchema = new Schema({
  type: {
    type: String,
    default: 'News'
  },
  api_url: {
    type: String
  },
  keyword: {
    type: String
  },
  refresh: {
    type: Number,
    default: 300
  }
})

module.exports = mongoose.model('News', NewsSchema)
