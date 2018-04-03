$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

// 1) render form
function createForm() {
    $.getJSON( "./config.json", function(data) {
        if(data.type == "select") {
            // possibly add <datalist>
            var items = [];
            $.each( data.options, function(key, val) {
            items.push( "<option value='" + key + "'>" + val + "</option>" );
            });

            $( "<select/>", {
                "class": "select-list",
                "id": "form-value",
                html: items.join( "" )
            }).prependTo( "form#dynamicForm" );
        } else if(data.type == "input") {
            // TODO
            // use "subtype" to determine text, checkbox, number, ...
        } else {
            $("form#dynamicForm > :input[type=submit]").val("Input type not supported").prop('disabled', true);
        }
        // Yes/No buttons
    });
}

// 2) upload to AWS
function submit() {
    $.getJSON( "./config.json", function(data) {
        AWS.config.update({accessKeyId: data.aws.key, secretAccessKey: data.aws.secret});
        var s3BucketName = data.aws.bucket;
        var s3RegionName = data.aws.region;

        timestamp = $.now();

        var s3key = data.aws.prefix + $.urlParam('pkname') + '_' + $.urlParam('id') + '_' + timestamp + '.csv';

        var header = [
            'pkname',
            'id',
            'keyname',
            'newvalue',
            'timestamp'
        ].join(',');
        var data = [
            $.urlParam('pkname'),
            $.urlParam('id'),
            $.urlParam('keyname'),
            $("#form-value").val(),
            timestamp
        ].join(',');
        var body = header + '\n' + data;
        var file = new File([new Blob([body])], 'temp');

        var s3 = new AWS.S3({params: {Bucket: s3BucketName, Region: s3RegionName}});
        s3.putObject({Key: s3key, ContentType: "text/csv", Body: file},
        function(err, data) {
            if (err) console.log(err); // an error occurred
            else     console.log(data);           // successful response
        });
    });
}

$(document).ready(function() {
    createForm();
});
