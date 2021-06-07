import AWS = require('aws-sdk');
import { config } from './config/config';

const c = config;

//Configure AWS
if(c.aws_profile !== "DEPLOYED") {
  const credentials: AWS.SharedIniFileCredentials = new AWS.SharedIniFileCredentials({profile: c.aws_profile});
  AWS.config.credentials = credentials;
  console.log("AWS.config.credentials.accessKeyId: " + AWS.config.credentials.accessKeyId);
}

console.log("config.aws_profile: " + c.aws_profile);
console.log("config.aws_region: " + c.aws_region);
console.log("config.aws_media_bucket: " + c.aws_media_bucket);

export const s3: AWS.S3 = new AWS.S3({
  signatureVersion: 'v4',
  region: c.aws_region,
  params: {Bucket: c.aws_media_bucket}
});


/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getGetSignedUrl( key: string ): string{

  const signedUrlExpireSeconds: number = 60 * 5

    const url: string = s3.getSignedUrl('getObject', {
        Bucket: c.aws_media_bucket,
        Key: key,
        Expires: signedUrlExpireSeconds
      });

    return url;
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getPutSignedUrl( key: string ): string{

    const signedUrlExpireSeconds = 60 * 5

    const url: string = s3.getSignedUrl('putObject', {
      Bucket: c.aws_media_bucket,
      Key: key,
      Expires: signedUrlExpireSeconds
    });

    return url;
}
