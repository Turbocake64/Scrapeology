// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Set up our port to be host designated or 2001
var PORT = process.env.PORT || 2001;

// Initialize Express
var app = express();

// Set up Express Router
var router = express.Router();

// Require routes file pass our router object
require("./config/routes")(router);

// Make our public folder a static directory
app.use(express.static(__dirname + "/public"));

// Connect Handelbars
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Use bodyParse
app.use(bodyParser.urlencoded({
    extended: false
}));

// Have requests go through our middleware
app.use(router);

// Use deployed db when deployed, otherwise use local 
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect Mongo to our db
mongoose.connect(MONGODB_URI);

axios.get("https://old.reddit.com").then(function(response) {

  var $ = cheerio.load(response.data);

  var results = [];

  $("div.top-matter").each(function(i, element) {

    var title = $(element).children("p.title").children("a").text();

    var titleLink = "https://old.reddit.com/" + $(element).children("p.title").children("a").attr("href");

    var subreddit = $(element).children("p.tagline").children("a").text();

    var subLink = $(element).children("p.tagline").children("a").attr("href");

    results.push({
      title: title,
      titleLink: titleLink,
      subreddit: subreddit,
      subLink: subLink
    });
  });

  console.log(results);

});

// Listen on port 2001
app.listen(PORT, function() {
  console.log("App running on port 2001!");
});
