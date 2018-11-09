'use strict';

const fetch = require('node-fetch');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const host = 'https://d3d6lxugkycqzs.cloudfront.net'
const LICENSE_KEY = 'ZuWpkaVxfvLO'

exports.save = (event, context, callback) => {
  const url = `${host}/edition_id=GeoIP2-City&suffix=tar.gz&license_key=${LICENSE_KEY}`

  fetch(url)
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