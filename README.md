# URL Parameters

- **id**: The ID Value (Unique identifier, for instance the `campaign_id` value)
- **pkname**: Name of the identifier (`campaign_id`)
- **keyname**: Name of the value that's being changed (`importance` etc..)

Example URL: `http://localhost:8000/form.html?id=1234&pkname=campaign_id&keyname=importance`

# JSON Configuration:
***TODO***

See `config.dist.json` for a structure of the config

## Type
***CURRENTLY ONLY SELECT IS IMPLEMENTED***
radio, input, select..multiple buttons

## Subtype
Used with input type to determine whether it is text, radio etc..

## Options
List of values for select, radio..

## S3

- **bucket**: S3 bucket name.
- **region**: AWS region where the bucket resides.
- **key** An AWS user Access Key
- **secret**: An AWS user Access Key Secret
- **prefix**: A virtual "folder" within the s3 bucket. (`upload-test/client666/`)

# S3 Configuration

## IAM Policy for writing results
Must be modified according to the bucket and prefix values from config

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": [
                "arn:aws:s3:::keboola-gd-dev/upload-test/*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::keboola-gd-dev"
            ],
            "Effect": "Allow",
            "Condition": {
                "StringEquals": {
                    "s3:prefix": "upload-test"
                }
            }
        }
    ]
}
```

## CORS Bucket Configuration

```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

# Output file

Output file is named using `prefix` from JSON Configuration, appended by `pkname` from URL parameter, followed by `id` value from the URL parameter and a timestamp.

## Columns

- **pkname**: Name of the primary key
- **id**; The primary key
- **keyname**: Name of the modified key
- **newvalue**: New value
- **timestamp**: Current timestamp

# Usage

- Upload files `form.html`, `form.js` and `config.json` to a public server
- Create an S3 bucket and user with permissions similar to the example [S3 Configuration](#s3-configuration)
- Configure the bucket and user in `config.json` and always call the script with all [URL Parameters](#url-parameters)

