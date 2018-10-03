const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RedditSchema = new Schema({
    type: {
        type: String,
        default: "Reddit"
    },
    subreddit: {
        type: String,
        required: true
    },
    max_article: {
        type: Number,
        default: 20
    },
    refresh: {
        type: Number,
        default: 300
    }
});

module.exports = mongoose.model('Reddit', RedditSchema);
