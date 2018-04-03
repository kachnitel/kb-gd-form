# URL Parameters

- **id**: The ID Value (Unique identifier, for instance the `campaign_id` value)
- **pkname**: Name of the identifier (`campaign_id`)
- **keyname**: Name of the value that**s being changed (`importance` etc..)

Example URL: `http://localhost:8000/form.html?id=1234&pkname=campaign_id&keyname=importance`

# JSON Configuration:

See `config.dist.json` for a structure of the config

## Type
radio, input, select..

## Values

## S3
token

### IAM Policy for writing results

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

### CORS Bucket Configuration

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
