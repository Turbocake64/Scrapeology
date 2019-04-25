var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var noteSchema = new Schema ({
    _redditPostId: {
        type: Schema.Types.ObjectId,
        ref: "redditPost",
    },
    date: String,
    noteText: String

});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;