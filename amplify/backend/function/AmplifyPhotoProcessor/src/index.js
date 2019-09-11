/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiAmplifyPhotosApiGraphQLAPIIdOutput = process.env.API_AMPLIFYPHOTOSAPI_GRAPHQLAPIIDOUTPUT
var apiAmplifyPhotosApiGraphQLAPIEndpointOutput = process.env.API_AMPLIFYPHOTOSAPI_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */
const sharp = require('sharp');
const exifReader = require('exif-reader');
const S3 = require('aws-sdk/clients/s3');

require('isomorphic-fetch');
const AWS = require('aws-sdk/global');
const AUTH_TYPE = require('aws-appsync/lib/link/auth-link').AUTH_TYPE;
const AWSAppSyncClient = require('aws-appsync').default;
const gql = require('graphql-tag');

const THUMBNAIL_WIDTH = 300;
const THUMBNAIL_HEIGHT = 300;

const APPSYNC_CONFIG = {
  url: process.env.API_AMPLIFYPHOTOSAPI_GRAPHQLAPIENDPOINTOUTPUT,
  region: process.env.REGION,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: AWS.config.credentials
  },
  disableOffline: true
};

let s3Client = null;
let appSyncClient = null;

//
// Load image from S3 by passing bucket and key.
//
async function loadImage(bucket, key) {
  const params = { Bucket: bucket, Key: key }
  return await s3Client.getObject(params).promise()
}

//
// Resize image to thumbnail and convert to JPEG; then put put in S3.
//
async function createThumbnail(bucket, key, image) {
  const thumbKey = key.replace('images', 'thumbs').replace(/\.[^\.]+$/, '.jpg');

  try {
    // Use Sharp to resize the image to and convert to JPEG format
    let thumb = await sharp(image)
                        .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
                        .jpeg()
                        .toBuffer();
              
    await s3Client.putObject({ Bucket: bucket, Key: thumbKey, Body: thumb }).promise();
    return { bucket: bucket, key: thumbKey, region: process.env.REGION };
  } catch (error) {
    console.error('[createThumbnail] ', error);
    throw error;
  }
}


//
// Retrieve metadata and EXIF data from image.
//
async function getPhotoMetadata(image) {
  try {
    const metadata = await sharp(image).metadata();

    let result = {
      height: metadata.height,
      width: metadata.width
    };

    const gps = getGpsData(metadata);
    if (gps) { result['gps'] = gps; }
    return result;
  } catch (error) {
    console.error('[storeExifData] ', error);
    return null;
  }
}

//
//
//
function getGpsData(metadata) {
  let result = null;

  try {
    const gps = exifReader(metadata.exif).gps;
    result = {
        latitude: `${gps.GPSLatitude[0]}°${gps.GPSLatitude[1]}'${gps.GPSLatitude[2]}"${gps.GPSLatitudeRef}`,
        longitude: `${gps.GPSLongitude[0]}°${gps.GPSLongitude[1]}'${gps.GPSLongitude[2]}"${gps.GPSLongitudeRef}`,
        altitude: gps.GPSAltitude
    }
  } catch (error) {
    console.warn('Failed to get EXIF data, may not exist');
  }

  return result;
}

//
// GraphQL mutation to update photo record properties.
//
const updatePhotoMutation =
`mutation UpdatePhoto($input: UpdatePhotoInput!) {
  updatePhoto(input: $input) {
    id
    createdAt
    updatedAt
    gps {
      latitude
      longitude
      altitude
    }
    thumb {
      key
    }
  }
}`;

//
// Store thumbnail and metadata via AppSync.
//
async function updatePhotoRecord(photoId, metadata, thumbnail) {
  let updatePhoto = {
    id: photoId,
    ...metadata,
    thumb: thumbnail
  }

  console.log(updatePhoto);

  try {
    const result = await appSyncClient.mutate({
      mutation: gql(updatePhotoMutation),
      variables: { input: updatePhoto }
    });

    console.log(result.data);
  } catch (error) {
    console.error('[updatePhotoRecord] ', error);
    throw error;
  }
}

//
// Main handler for Lambda function.
//
exports.handler = async (event) => {
  if (!s3Client)  { s3Client = new S3() }
  if (!appSyncClient) { appSyncClient = new AWSAppSyncClient(APPSYNC_CONFIG) }

  const bucket = event.Records[0].s3.bucket.name; //eslint-disable-line
  const key = event.Records[0].s3.object.key; //eslint-disable-line

  try {
    let image = await loadImage(bucket, key);

    // create a thumbnail of the original image and store in S3
    let thumb = await createThumbnail(bucket, key, image.Body);

    // capture metadata from original photo
    let metadata = await getPhotoMetadata(image.Body);

    // finally, update the record in DynamoDB via AppSync
    await updatePhotoRecord(image.Metadata.photoid, metadata, thumb);
  } catch (e) {
    console.error('An error occurred');
    return Error(e);
  }

  return { success: true }
};
