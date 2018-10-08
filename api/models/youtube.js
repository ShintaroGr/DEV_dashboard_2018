const mongoose = require('mongoose')
const Schema = mongoose.Schema

const YoutubeChannelSchema = new Schema({
  type: {
    type: String,
    default: 'YoutubeChannel'
  },

  youtube_username: {
    type: String,
    required: true
  },
  refresh: {
    type: Number,
    default: 300
  }
}, { getters: true })

YoutubeChannelSchema.virtual('api_url').get(function () {
  return 'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&key=AIzaSyCLWyuC1IuQxDfAiwX2nYnn1WWRnqZKTJk&forUsername=' + this.youtube_username
})

const YoutubeVideoCommentSchema = new Schema({
  type: {
    type: String,
    default: 'YoutubeVideoComment'
  },
  youtube_video: {
    type: String,
    required: true
  },
  max_comment: {
    type: Number,
    default: 20
  },
  refresh: {
    type: Number,
    default: 300
  }
}, { getters: true })

YoutubeVideoCommentSchema.virtual('api_url').get(function () {
  return 'https://www.googleapis.com/youtube/v3/commentThreads?videoId=' + this.youtube_video + '&part=snippet,replies&key=AIzaSyCLWyuC1IuQxDfAiwX2nYnn1WWRnqZKTJk'
})

const YoutubeLastVideoSchema = new Schema({
  type: {
    type: String,
    default: 'YoutubeLastVideo'
  },
  youtube_username: {
    type: String,
    required: true
  },
  refresh: {
    type: Number,
    default: 300
  }
}, { getters: true })

YoutubeLastVideoSchema.virtual('api_url').get(function () {
  return 'https://www.googleapis.com/youtube/v3/commentThreads?videoId=' + this.youtube_video + '&part=snippet,replies&key=AIzaSyCLWyuC1IuQxDfAiwX2nYnn1WWRnqZKTJk'
})

module.exports = {
  Channel: mongoose.model('YoutubeChannel', YoutubeChannelSchema),
  Comment: mongoose.model('YoutubeVideoComment', YoutubeVideoCommentSchema),
  Video: mongoose.model('YoutubeLastVideo', YoutubeLastVideoSchema)
}
