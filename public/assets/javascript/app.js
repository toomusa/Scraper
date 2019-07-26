
console.log("App.js is connected")

$(document).on("click", ".submitBtn", function(){

    let domId = $(this).attr("id").substring(6);
    let title = $(`#title${domId}`).text();
    let summary = $(`#summary${domId}`).text();
    let photo = $(`#photo${domId}`).attr("src");
    let link = $(`#link${domId}`).attr("href");

    let result = {title, summary, photo, link, domId};

    $.post("/save", result, function(id){
        console.log("Article Saved");
        $(`#submit${id}`).text("Saved").addClass("savedBtn");
    })

})

let noteId = 0;

$(document).on("click", ".noteBtn", function(){
    
    noteId = 0;
    noteId = $(this).attr("id").substring(4);
    let title = $(`#title${noteId}`).text();
    let summary = $(`#summary${noteId}`).text();
    let photo = $(`#photo${noteId}`).attr("src");
    let link = $(`#link${noteId}`).attr("href");

    let result = {title, summary, photo, link, noteId};
    console.log(result)

    $.post("/checknote", result, (savedNote) => {
        console.log(savedNote.note)
        if (savedNote) {
            let noteTitle = savedNote.note.title; 
            let note = savedNote.note.body;
            $("#noteTitle").val(noteTitle);
            $("#note").val(note);
        }
    })
    
    $("#note-modal").modal("toggle");
})


$("#note-modal").on("click", "#noteSubmit", () => {

    let domId = noteId;
    let title = $(`#title${domId}`).text();
    let summary = $(`#summary${domId}`).text();
    let photo = $(`#photo${domId}`).attr("src");
    let link = $(`#link${domId}`).attr("href");

    let noteTitle = $("#noteTitle").val();
    let note = $("#note").val();

    console.log(noteTitle)
    console.log(note)

    $("#noteTitle").val("");
    $("#note").val("");
    
    let result = {title, summary, photo, link, domId, noteTitle, note};
    
    $.post("/addnote", result, function(id) {
        console.log("Note Added");
        console.log(id);
        $(`#note${id}`).text("Added").addClass("savedBtn");
    })
})