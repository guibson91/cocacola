const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const apkPath = process.argv[2];
const environment = process.env.ENVIRONMENT || "development";
const bucketName = "orbitta-app";
const s3Key = `APK/${environment}/${path.basename(apkPath)}`;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

async function uploadFileToS3() {
  const fileContent = fs.readFileSync(apkPath);
  const params = {
    Bucket: bucketName,
    Key: s3Key,
    Body: fileContent,
    ACL: "public-read",
  };
  try {
    const uploadResponse = await s3.upload(params).promise();
    return uploadResponse.Location;
  } catch (error) {
    return `Error: Failed to upload APK to S3 - ${error.message}`;
  }
}

uploadFileToS3()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(`Error: ${error}`);
  });
