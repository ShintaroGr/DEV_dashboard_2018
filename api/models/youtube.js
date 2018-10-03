const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const YoutubeChannelSchema = new Schema({
    type: {
        type: String,
        default: "YoutubeChannel"
    },
    youtube_username: {
        type: String,
        required: true
    },
    refresh: {
        type: Number,
        default: 300
    }
});

const YoutubeVideoCommentSchema = new Schema({
    type: {
        type: String,
        default: "YoutubeVideoComment"
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
});

const YoutubeLastVideoSchema = new Schema({
    type: {
        type: String,
        default: "YoutubeLastVideo"
    },
    youtube_username: {
        type: String,
        required: true
    },
    refresh: {
        type: Number,
        default: 300
    }
});


module.exports = {
    channel: mongoose.model('YoutubeChannel', YoutubeChannelSchema),
    comment: mongoose.model('YoutubeVideoComment', YoutubeVideoCommentSchema),
    video: mongoose.model('YoutubeLastVideo', YoutubeLastVideoSchema)
};
