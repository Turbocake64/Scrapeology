$(document).ready(function() {
    console.log("saved.js Connected");

    var redditPostContainer = $("#reddit-post-container");
    $(document).on("click", ".btn.delete", handlePostDelete);
    $(document).on("click", ".btn.notes", handlePostNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    initPage();

    function initPage() {
        redditPostContainer.empty();
        $.get("/api/redditposts?saved=true")
        .then(function(data) {
            // render posts to the page if there are any
            if (data && data.length) {
                renderPosts(data);
            } else {
                renderEmpty();
            }
        });
    }

    function renderPosts(savedPosts) {
        var redditPostPanels = [];

        for (var i = 0; i < savedPosts.length; i++) {
            redditPostPanels.push(createPanel(savedPosts[i]));
        }
        redditPostContainer.append(redditPostPanels);
    }

    function createPanel(post) {
        var panel = $([
            "<div class='panel panel-default'>",
            "<div class='panel-heading ext-center'>",
            "<h3>",
            post.title,
            "<button class='btn btn-danger delete'>",
            "Delete from Saved",
            "</button>",
            "<button class='btn btn-info notes'>Article Notes</button>",
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
           "<h4>Whoops, looks Like you haven't saved any posts yet.</h4>",
           "</div>",
           "<div class='panel panel-default'>",
           "<div class='panel-heading ext-center'>",
           "<h3>Would you like to brows available posts?</h3>",
           "</div>",
           "<div class='panel-body text-centered'>",
           "<h4><a class='scrape-new'>Browse</a></h4>",
           "</div>",
           "</div>"
    ].join(""));
    //append data to the page
    redditPostContainer.append(emptyAlert);
    };

    function renderNotesList(data) {

        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = [
                "<li class='list-group-item'>",
                "No notes yet!",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        } else {
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $([
                    "<li class='list-group-item'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>X</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes._id);
                notesToRender.push(currentNote);
            }
        }
        $(".note-container").push(notesToRender);
    }

    function handlePostDelete() {
        var postToDelete = $(this).parents(".panel").data();
        $.ajax({
            method: "DELETE",
            url: "/api/redditposts/" + postToDelete._id
        }).then(function(data) {
            if(data.ok) {
                initPage();
            }
        });
    }

    function handlePostNotes() {
        var currentPost = $(this).parents(".panel").data();
        console.log(currentPost);
        $.get("/api/notes/" + currentPost._id).then(function(data) {
            console.log(data);
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Post Notes: ",
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save' data-post=" + currentPost._id + ">Save Note</button>",
                "</div>"
                ].join("");
                console.log(noteData);

                bootbox.dialog({
                    message: modalText,
                    closeButton: true
                });
                var noteData = {
                    _id: currentPost._id,
                    notes: data || []
                };

                $(".btn-save").data("post", noteData);


                renderNotesList(noteData);
        })
    }

    function handleNoteSave() {

        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if (newNote) {
            noteData = {
                _id: $(this).data("post")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function() {
                bootbox.hideAll();
                initPage();
            });
            
        } 
    }

    function handleNoteDelete() {

        var noteToDelete = $(this).data("_id");
        $.ajax({
            method: "DELETE",
            url: "/api/notes/" + noteToDelete
        }).then(function() {
            hideAll();
        });

    }

});