# Configuration:

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

