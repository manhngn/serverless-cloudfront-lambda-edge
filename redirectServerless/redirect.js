'use strict';

exports.handler = (event, context, callback) => {
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