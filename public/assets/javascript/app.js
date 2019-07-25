
console.log("App.js is connected")

$(document).on("click", ".submitBtn", function(){

    let id = $(this).attr("id");
    let title = $(`#title${id}`).text();
    let summary = $(`#summary${id}`).text();
    let photo = $(`#photo${id}`).attr("src");
    let link = $(`#link${id}`).attr("href");

    let result = {title, summary, photo, link, id};

    $.post("/save", result, function(id){
        console.log("Article saved");
        $(`#${id}`).text("Saved").attr("id", "savedBtn");
    })

})