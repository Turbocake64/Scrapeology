var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var RedditPostSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    titleLink: {
        type: String,
        required: true
    },
    subreddit: {
        type: String,
        required: true,
    },
    subLink: {
        type: String,
        required: true,
    },
    saved: {
        type: Boolean,
        default: false
    }

});

var RedditPost = mongoose.model("RedditPost", RedditPostSchema);

module.exports = RedditPost;