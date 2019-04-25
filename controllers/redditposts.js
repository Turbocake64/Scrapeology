// Bring in our scrape & makeDate scripts
var scrape = require("../scripts/scraper");
var makeDate = require("../scripts/dates");

// Bring in the RedditPost & Note mongoose models
var RedditPost = require("../models/RedditPost");

module.exports = {
    fetch: function(cb) {
        scrape(function(results) {
            console.log("Results: ", results);
            // var results = data;
            for (var i=0; i < results.length; i++) {
                results[i].date = makeDate();
                results[i].saved = false; 
            };

            RedditPost.collection.insertMany(results, {ordered:false}, function(err, docs){
                cb(err, docs);
            })
        })
    },
    delete: function(query, cb) {
        RedditPost.remove(query, cb);
    },
    get: function(query, cb) {
        RedditPost.find(query)
        .sort({
            _id: -1
        })
        .exec(function(err, doc) {
            cb(doc);
        })
    },
    update: function(query, cb) {
        RedditPost.update({_id: query._id}, {
            $set: query
        }, {}, cb)
    }
}