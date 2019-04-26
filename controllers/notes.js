var Note = require("../models/Note");
var makeDate = require("../scripts/dates");

module.exports = {
    get: function(data, cb) {
        Note.find({
            redditPostId: data._id
        }, cb);
    },
    save: function(data, cb) {
        var newNote = {
            redditPostId: data._id,
            date: makeDate(),
            noteText: data.noteText
        };
        Note.create(newNote, function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log(doc);
                cb(doc);
            };
        });
    },
    delete: function(data, cb) {
        Note.remove({
            _id: data._id
        }, cb);
    }
};