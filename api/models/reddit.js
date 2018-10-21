const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RedditSchema = new Schema({
  type: {
    type: String,
    default: 'Reddit'
  },
  subreddit: {
    type: String,
    required: true
  },
  sort: {
    type: String,
    default: 'hot',
    enum: ['hot', 'new', 'rising', 'top']
  },
  max_article: {
    type: Number,
    default: 30
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

RedditSchema.virtual('api_url').get(function () {
  return 'https://www.reddit.com/r/' + this.subreddit + '/' + this.sort + '/.json?limit=' + this.max_article
})

module.exports = mongoose.model('Reddit', RedditSchema)
