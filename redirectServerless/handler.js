'use strict';

const fetch = require('node-fetch');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.redirect = (event, context, callback) => {
  const response = {
    status: '302',
    statusDescription: 'Found',
    headers: {
      location: [{
        key: 'Location',
        value: 'http://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html',
      }],
    },
  };
  callback(null, response);
};

exports.save = (event, context, callback) => {
  fetch(event.image_url)
    .then((response) => {
      if (response.ok) {
        return response;
      }
      return Promise.reject(new Error(
        `Failed to fetch ${response.url}: ${response.status} ${response.statusText}`));
    })
    .then(response => response.buffer())
    .then(buffer => (
      s3.putObject({
        Bucket: process.env.BUCKET,
        Key: event.key,
        Body: buffer,
      }).promise()
    ))
    .then(v => callback(null, v), callback);
};