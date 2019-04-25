var axios = require("axios");
var cheerio = require("cheerio");

const scrape = function(cb) {

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
  cb(results);

});

};

module.exports = scrape;
