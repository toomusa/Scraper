
$(document).on("click", ".submitBtn", function(){

    let _id = $(this).attr("id").substring(6);
    let title = $(`#title${_id}`).text();
    let summary = $(`#summary${_id}`).text();
    let photo = $(`#photo${_id}`).attr("src");
    let link = $(`#link${_id}`).attr("href");

    let result = {title, summary, photo, link, _id};

    if ($(this).text() === "Save Article") {
        $.post("/save", result, function(result){
            $(`#note${result._id}`).attr("disabled", false);
            $(`#submit${result._id}`).text("Remove");
        })
    } else if ($(this).text() === "Remove") {
        $.post("/remove", result, function(result){
            $(`#note${result._id}`).text("Add Note").attr("disabled", true);
            $(`#submit${result._id}`).text("Save Article");
        })
    }
})


$(document).on("click", ".noteBtn", function(){
    
    let _id = $(this).attr("id").substring(4);
    let title = $(`#title${_id}`).text();
    let summary = $(`#summary${_id}`).text();
    let photo = $(`#photo${_id}`).attr("src");
    let link = $(`#link${_id}`).attr("href");

    let result = {title, summary, photo, link, _id};
    $("#note-modal").attr("data-id", `modal${_id}`)

    $.post("/checknote", result, (savedNote) => {
        if (savedNote.note) {
            let noteTitle = (savedNote.note.title) ? savedNote.note.title : ""; 
            let noteBody = (savedNote.note.body) ? savedNote.note.body : "";
            let noteId = savedNote.note._id;
            $("#noteTitle").val(noteTitle);
            $("#note").val(noteBody);
            $("#note-modal").attr("note-id", `note${noteId}`)
        }
        $("#note-modal").modal("toggle");
    })
})


$("#note-modal").on("click", "#noteSubmit", () => {

    let _id = $("#note-modal").attr("data-id").substring(5);
    let title = $(`#title${_id}`).text();
    let summary = $(`#summary${_id}`).text();
    let photo = $(`#photo${_id}`).attr("src");
    let link = $(`#link${_id}`).attr("href");

    let noteId = $("#note-modal").attr("note-id").substring(4);
    let noteTitle = $("#noteTitle").val();
    let noteBody = $("#note").val();

    $("#noteTitle").val("");
    $("#note").val("");
    
    let result = {_id, title, summary, photo, link, noteId, noteTitle, noteBody};
    
    $.post("/addnote", result, function(articleWithNote) {
        let _id = articleWithNote._id;
        $(`#note${_id}`).text("View Note");
    })
})


$("#note-modal").on("hidden.bs.modal", () => {
    $("#note-modal").attr("note-id", `temp`)
    $("#noteTitle").val("");
    $("#note").val("");
})