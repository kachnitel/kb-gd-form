$.urlParam = function(name){
    // TODO error catch
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if(!results) {
        console.log("Missing parameter " + name);
        return 0;
    }
    return results[1] || 0;
}

// 1) render form
function createForm() {
    $.getJSON("./config.json", function(data) {
        if(data.type == "select") {
            // possibly add <datalist>
            var items = [];
            $.each(data.options, function(key, val) {
                items.push("<option value='" + key + "'>" + val + "</option>" );
            });

            $("<select/>", {
                "class": "select-list",
                "id": "form-value",
                html: items.join( "" )
            }).prependTo("form#dynamic-form");
        } else if(data.type == "input") {
            // use "subtype" to determine text, number, ...
            $("<input/>", {
                "type": data.subtype || "text",
                "id": "form-value"
            }).prependTo("form#dynamic-form");
        } else if(data.type == "radio") {
            $.each(data.options, function(key, val) {
//                 items.push("<input type='radio' name='radio' value='" + key + "'> " + val);
                $("<input/>", {
                    "type": "radio",
                    "name": "form-value",
                    "id": key,
                    "value": key
                }).insertBefore("#formsend");
                $("<label/>", {
                    "for": key,
                    "text": val
                }).insertBefore("#formsend");
            })
        } else if (data.type == "button") {
            // create a hidden input to set value after clicking button
            $("<input/>", {
                "type": "hidden",
                "id": "form-value"
            }).insertAfter("#formsend");

            $.each(data.options, function(key, val) {
                $("<button/>", {
                    "type": "submit",
                    "id": key,
                    "value": key,
                    "text": val
                }).click(function() {
                    $("#form-value").val(key);
                }).insertBefore("#formsend");
            })
            $("#formsend").remove();
        } else {
            $("#formsend").val("Input type not supported").prop('disabled', true);
        }
        // Yes/No buttons
    });
}

function validateValue(value, config) {
    if(typeof(config.min) != "undefined" && config.min !== null && value < config.min) {
        alert("Value (" + value + ") has to be higher than " + config.min);
        return 0;
    }
    if(typeof(config.max) != "undefined" && config.max !== null && value > config.max) {
        alert("Value (" + value + ") has to be lower than " + config.max);
        return 0;
    }
    return 1;
}

// 2) upload to AWS
function submit() {
    var value = $("#form-value").val() || $("input[name='form-value']:checked").val();

    if(value === undefined) {
        alert("Value is not set!");
        return;
    }

    var confirmationString = "Set '" + $.urlParam('keyname') + "' to: " + value;
    var confirmed = confirm(confirmationString);
    if(!confirmed) return;

    $.getJSON( "./config.json", function(data) {
        if(!validateValue(value, data)) {
            return;
        }

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
            value,
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
