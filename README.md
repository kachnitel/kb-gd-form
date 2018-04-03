# URL Parameters

- **id**: The ID Value (Unique identifier, for instance the `campaign_id` value)
- **pkname**: Name of the identifier (`campaign_id`)
- **keyname**: Name of the value that's being changed (`importance` etc..)

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

