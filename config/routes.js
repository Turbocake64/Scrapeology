var scrape = require("../scripts/scraper");

var redditPostController = require("../controllers/redditposts");
var notesController = require("../controllers/notes");


module.exports = function(router) {

    // render the homepage
    router.get("/", function(req, res) {
        res.render("home");
    });

    // render saved articles page
    router.get("/saved", function(req, res) {
        res.render("saved");
    });

    // fetch
    router.get("/api/fetch", function(req, res) {
        redditPostController.fetch(function(err, docs) {
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new reddit. Check back soon."
                });
            } else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });

    router.get("/api/redditposts", function(req, res) {
        var query = {};
        if (req.query.saved) {
            query = req.query;
        }

        redditPostController.get(query, function(data) {
            res.json(data);
        });
    });

    router.delete("api/redditposts/:id", function(req, res) {
        var query = {};
        query._id = req.params.id;
        redditPostController.delete(query, function( err, data) {
            res.json(data);
        });
    });

    router.patch("api/redditposts/", function(req, res) {
        redditPostController.update(req.body, function(err, data) {
            res.json(data);
        });
    });

    router.get("api/notes/:headline_id", function(req, res) {
        var query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        }

        notesController.get(query, function(err, data) {
            res.json(data);
        });
    });
    router.delete("api/notes/:id", function(req, res) {
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data) {
            res.json(data)
        });
    });
    router.post("api/notes", function(req, res) {
        notesController.save(req.body, function(err, data) {
            res.json(data);
        });
    });
};