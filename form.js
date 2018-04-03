// 1) render form
function createForm() {
    $.getJSON( "./config.json", function( data ) {
        console.log(data)
        if(data.type == "select") {
            // possibly add <datalist>
            var items = [];
            $.each( data.options, function( key, val ) {
            items.push( "<option value='" + key + "'>" + val + "</option>" );
            });

            $( "<select/>", {
                "class": "select-list",
                html: items.join( "" )
            }).prependTo( "form#dynamicForm" );
        } else if(data.type == "input") {
            // use "subtype" to determine text, checkbox, number, ...
        } else {
            $("form#dynamicForm > :input[type=submit]").val("Input type not supported").prop('disabled', true);
        }
        // Yes/No buttons
    });
}

// 2) upload to AWS
function submit() {
//     console.log($("form#dynamicForm")[0][0].value);
    var formData = new FormData("form#dynamicForm");
    console.log(FormData);
}

$(document).ready(function() {
    createForm();
});
