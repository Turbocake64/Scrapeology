// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");

// Require axios and cheerio. This makes the scraping possible
const axios = require("axios");
const cheerio = require("cheerio");

// Initialize Express
const app = express();

// Set up our port to be host designated or 2001
const PORT = process.env.PORT || 2001;

// Use deployed db when deployed, otherwise use local 
const databaseURL = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

const db = require("./models");

// Set up Express Router
const router = express.Router();

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

// Connect Mongo to our db
mongoose.connect(databaseURL, { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
  var results = [];
axios.get("https://old.reddit.com").then(function(response) {

  var $ = cheerio.load(response.data);


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
  
  // console.log(results);
  
}).then((data) => {
  // console.log(results[0])
  results.forEach(result => db.RedditPost.create(result))
  
.catch(function(err) {
  console.log(err.code);
})
.then(function(data) {
  res.send("Articles scraped");
});

});
});

// Listen on port 2001
app.listen(PORT, function() {
  console.log("App running on port 2001!");
});
