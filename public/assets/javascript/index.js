
$(document).ready(function() {
    console.log("index Connected");
    var redditPostContainer = $("#reddit-post-container");
    $(document).on("click", ".btn.save", handlePostSave);
    $(document).on("click", ".scrape-new", handlePostScraped);

    // Run the init page when once the page is ready
    initPage();

    function initPage() {
        //Empty the post container, run an ajax request for unsaved posts
        redditPostContainer.empty();
        $.get("api/redditposts?saved=false")
        .then(function(data) {
            // render posts to the page if there are any
            if (data && data.length) {
                renderPosts(data);
            } else {
                renderEmpty();
            }
        });
    };

    function renderPosts(results) {
        var redditPostPanels = [];

        for (var i = 0; i < results.length; i++) {
            redditPostPanels.push(createPanel(results[i]));
        }
        redditPostContainer.append(redditPostPanels);
    }

    function createPanel(post) {
        var panel = $([
            "<div class='panel panel-default'>",
            "<div class='panel-heading ext-center'>",
            "<h3>",
            post.title,
            "<a class='btn btn-success save'>",
            "Save Post",
            "</a>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
            post.subreddit,
            "</div>",
            "</div>"                        
            ].join(""));
        
        panel.data("_id", post._id);
        return panel;
    }

    function renderEmpty() {

        var emptyAlert =
        $(["<div class='alert alert-warning text-center'>",
           "<h4>Whoops, looks Like we're fresh out of posts.</h4>",
           "</div>",
           "<div class='panel panel-default'>",
           "<div class='panel-heading ext-center'>",
           "<h3>What would you like to do now?</h3>",
           "</div>",
           "<div class='panel-body text-centered'>",
           "<h4><a class='scrape-new'>Try scraping new posts?</a></h4>",
           "</div>",
           "</div>"
    ].join(""));
    //append data to the page
    $(".reddit-post-container").append(emptyAlert);
    };

    function handlePostSave() {

        var postToSave = $(this).parents(".panel").data();
        postToSave.saved = true;

        $.ajax({
            method: "POST",
            url: "/api/redditposts",
            data: postToSave
        })
        .then(function(data) {
            if (data.ok) {
                initPage();
            }
        });
    };

    function handlePostScraped() {
        console.log("button exists")

        $.get("/api/fetch")
            .then(function(data) {
                initPage();
                alert(data.message)
            });
    };
});