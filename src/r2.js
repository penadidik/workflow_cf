// src/r2.js
import fs from 'fs';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

function buildClient(endpoint) {
  const accountId = process.env.CF_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.C3_R2_KEY;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || process.env.C3_R2_SECRET;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials not found in env (R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY).');
  }

  const region = 'auto';

  const endpointUrl = endpoint || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
  if (!endpointUrl) {
    throw new Error('R2 endpoint could not be determined. Set CF_ACCOUNT_ID or pass --endpoint.');
  }

  return new S3Client({
    endpoint: endpointUrl,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: false
  });
}

export async function uploadFileToR2({ bucket, file, key, endpoint }) {
  const client = buildClient(endpoint);

  const fileStream = fs.createReadStream(file);
  const uploadParams = {
    Bucket: bucket,
    Key: key,
    Body: fileStream
  };

  const parallelUploads3 = new Upload({
    client,
    params: uploadParams,
    queueSize: 4,
    partSize: 5 * 1024 * 1024
  });

  await parallelUploads3.done();
}

export async function listR2Objects({ bucket, endpoint }) {
  const client = buildClient(endpoint);
  const cmd = new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1000 });
  const res = await client.send(cmd);
  return res.Contents || [];
}

