const mongoose = require('mongoose')
const Schema = mongoose.Schema

const YoutubeChannelSchema = new Schema({
  type: {
    type: String,
    default: 'YoutubeChannel'
  },
  api_url: {
    type: String
  },
  youtube_username: {
    type: String,
    required: true
  },
  refresh: {
    type: Number,
    default: 300
  }
})

const YoutubeVideoCommentSchema = new Schema({
  type: {
    type: String,
    default: 'YoutubeVideoComment'
  },
  api_url: {
    type: String
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
})

const YoutubeLastVideoSchema = new Schema({
  type: {
    type: String,
    default: 'YoutubeLastVideo'
  },
  api_url: {
    type: String
  },
  youtube_username: {
    type: String,
    required: true
  },
  refresh: {
    type: Number,
    default: 300
  }
})

module.exports = {
  Channel: mongoose.model('YoutubeChannel', YoutubeChannelSchema),
  Comment: mongoose.model('YoutubeVideoComment', YoutubeVideoCommentSchema),
  Video: mongoose.model('YoutubeLastVideo', YoutubeLastVideoSchema)
}
