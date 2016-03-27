var aws = require('aws-sdk');
var helpers = require('../server/helpers.js');
var env = require('node-env-file');
var pe, accessKeyId, secretAccessKey, region, endpoint;

if(!process.env.TRAVIS) {
  pe = env(__dirname + '../../.env');
}


if(process.env.accessKeyId) {
  accessKeyId = pe.accessKeyId;
  secretAccessKey = pe.secretAccessKey;
  endpoint = "dynamodb.us-east-1.amazonaws.com";
  region = "us-east-1";
}
else {
  accessKeyId = "fakeAccessKey";
  secretAccessKey = "fakeSecretAccessKey";
  endpoint = "http://localhost:8000";
  region = "fakeRegion";
}

aws.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region,
  endpoint: new aws.Endpoint(endpoint)
});

var db = new aws.DynamoDB();
var dbSchema = new aws.DynamoDB.DocumentClient();

var userTableParams = {
  TableName: "Users",
  KeySchema: [
    {AttributeName: "userId", KeyType: "HASH"},
  ],
  AttributeDefinitions: [
    {AttributeName: "userId", AttributeType: "N"},
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  }
};

var spotTableParams = {
  TableName: "Spots",
  KeySchema: [
    {AttributeName: "spotId", KeyType: "HASH"}
  ],
  AttributeDefinitions: [
    {AttributeName: "spotId", AttributeType: "N"}
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 2,
    WriteCapacityUnits: 2
  }
};

db.createTable(userTableParams, function (err, data) {
  if (err) {
    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    var userParams = {
      TableName: "Users",
      Item: {
        userId: 0,
        lastId: 0
      }
    };

    dbSchema.put(userParams, function(err, data) {
      if (err) {
        console.error('Users: on item put', err);
      }
      else {
        console.log('data', data);
      }
    });
  }
});

db.createTable(spotTableParams, function (err, data) {
  if (err) {
    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    helpers.spotCleaner();
  } else {
    console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    var spotParams = {
      TableName: "Spots",
      Item: {
        spotId: 0,
        lastId: 0
      }
    };

    dbSchema.put(spotParams, function(err, data) {
      if (err) {
        console.error('on item put', err);
        helpers.spotCleaner();
      }
      else {
        console.log('data', data);
        helpers.spotCleaner();
      }
    });
  }
});

  


  


db.listTables(function(err, data) {
  console.log(data);
});

module.exports.db = db;
