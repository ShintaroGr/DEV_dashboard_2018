const mongoose = require('mongoose')
const Schema = mongoose.Schema

const YoutubeChannelSchema = new Schema({
  type: {
    type: String,
    default: 'YoutubeChannel'
  },
  youtube_id: {
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

YoutubeChannelSchema.virtual('api_url').get(function () {
  return 'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&key=AIzaSyCLWyuC1IuQxDfAiwX2nYnn1WWRnqZKTJk&id=' + this.youtube_id
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
  },
  position: {
    type: Number,
    default: 0
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
  youtube_id: {
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

YoutubeLastVideoSchema.virtual('api_url').get(function () {
  return 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' + this.youtube_id + '&maxResults=1&order=date&type=video&key=AIzaSyCLWyuC1IuQxDfAiwX2nYnn1WWRnqZKTJk'
})

module.exports = {
  Channel: mongoose.model('YoutubeChannel', YoutubeChannelSchema),
  Comment: mongoose.model('YoutubeVideoComment', YoutubeVideoCommentSchema),
  Video: mongoose.model('YoutubeLastVideo', YoutubeLastVideoSchema)
}
