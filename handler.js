"use strict";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const { v4: uuidv4 } = require("uuid");

const postsTable = process.env.POSTS_TABLE;
// Create a response
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(message),
  };
}

// Helper function
// function sortByDate(a, b) {
//   if (a.createdAt > b.createdAt) {
//     return -1;
//   } else return 1;
// }

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create a post
module.exports.createVideo = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);
  const rand = getRandomInt(10);

  // if (
  //   !reqBody.title ||
  //   reqBody.title.trim() === "" ||
  //   !reqBody.body ||
  //   reqBody.body.trim() === ""
  // ) {
  //   return callback(
  //     null,
  //     response(400, {
  //       error: "Post must have a title and body and they must not be empty",
  //     })
  //   );
  // }

  const post = {
    id: uuidv4(),
    videoID: reqBody.videoID,
    numberOfReplies: 0,
    profilePicture: reqBody.profilePicture,
    user: {
      firstName: reqBody.user.firstName,
      lastName: reqBody.user.lastName,
    },
    reviews: {
      likes: 0,
      disLikes: 0,
    },
    trend: Date.parse(new Date().toISOString()) + rand,
    creatSort: Date.parse(new Date().toISOString()) + rand,
    createdAt: new Date().toISOString(),
    body: reqBody.body,
    replies: [],
  };

  return db
    .put({
      TableName: postsTable,
      Item: post,
    })
    .promise()
    .then(() => {
      callback(null, response(201, post));
    })
    .catch((err) => response(null, response(err.statusCode, err)));
};

// Get all posts
module.exports.getAllVideos = (event, context, callback) => {
  return db
    .scan({
      TableName: postsTable,
    })
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items.reverse()));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// Get all videos with a specific ID
module.exports.getAllVideoID = (event, context, callback) => {
  const videoID = event.pathParameters.videoID;

  const param = {
    TableName: postsTable,
    IndexName: "myLSI",
    KeyConditionExpression: "videoID = :hkey",
    ExpressionAttributeValues: {
      ":hkey": videoID,
    },
  };

  return db
    .query(param)
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items.reverse()));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// Get number of posts
// module.exports.getPosts = (event, context, callback) => {
//   const numberOfPosts = event.pathParameters.number;
//   const params = {
//     TableName: postsTable,
//     Limit: numberOfPosts,
//   };
//   return db
//     .scan(params)
//     .promise()
//     .then((res) => {
//       callback(null, response(200, res.Items.sort(sortByDate)));
//     })
//     .catch((err) => callback(null, response(err.statusCode, err)));
// };

// Get a single post
module.exports.getPost = (event, context, callback) => {
  const videoID = event.pathParameters.videoID;
  const creatSort = event.pathParameters.creatSort;

  const params = {
    Key: {
      videoID: videoID,
      creatSort: parseInt(creatSort),
    },
    TableName: postsTable,
  };

  return db
    .get(params)
    .promise()
    .then((res) => {
      if (res.Item) callback(null, response(200, res.Item));
      else callback(null, response(404, { error: "Post not found" }));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// Like Main Post
module.exports.likeComment = (event, context, callback) => {
  const videoID = event.pathParameters.videoID;
  const creatSort = event.pathParameters.creatSort;

  const params = {
    Key: {
      videoID: videoID,
      creatSort: parseInt(creatSort),
    },
    TableName: postsTable,
    //ConditionExpression: "attribute_exists(id)",
    UpdateExpression:
      "SET reviews.likes = reviews.likes + :val, trend = trend + :dateNow",
    ExpressionAttributeValues: {
      ":val": 1,
      ":dateNow": parseInt(Date.parse(new Date().toISOString())),
    },
    //ReturnValues: "UPDATED_NEW",
    ReturnValues: "ALL_NEW",
  };
  console.log("Updating");

  return db
    .update(params)
    .promise()
    .then((res) => {
      //console.log(res);
      callback(null, response(200, res.Attributes));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// Unlike Main Post
module.exports.unLikeComment = (event, context, callback) => {
  const videoID = event.pathParameters.videoID;
  const creatSort = event.pathParameters.creatSort;

  const params = {
    Key: {
      videoID: videoID,
      creatSort: parseInt(creatSort),
    },
    TableName: postsTable,
    //ConditionExpression: "attribute_exists(id)",
    UpdateExpression:
      "SET reviews.likes = reviews.likes - :val, trend = trend - :dateNow",
    ExpressionAttributeValues: {
      ":val": 1,
      ":dateNow": parseInt(Date.parse(new Date().toISOString())),
    },
    //ReturnValues: "UPDATED_NEW",
    ReturnValues: "ALL_NEW",
  };
  console.log("Updating");

  return db
    .update(params)
    .promise()
    .then((res) => {
      //console.log(res);
      callback(null, response(200, res.Attributes));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// Dislike Main Post
module.exports.disLikeComment = (event, context, callback) => {
  const videoID = event.pathParameters.videoID;
  const creatSort = event.pathParameters.creatSort;

  const params = {
    Key: {
      videoID: videoID,
      creatSort: parseInt(creatSort),
    },
    TableName: postsTable,
    //ConditionExpression: "attribute_exists(id)",
    UpdateExpression:
      "SET reviews.disLikes = reviews.disLikes + :val, trend = trend - :dateNow",
    ExpressionAttributeValues: {
      ":val": 1,
      ":dateNow": parseInt(Date.parse(new Date().toISOString())),
    },
    //ReturnValues: "UPDATED_NEW",
    ReturnValues: "ALL_NEW",
  };
  console.log("Updating");

  return db
    .update(params)
    .promise()
    .then((res) => {
      //console.log(res);
      callback(null, response(200, res.Attributes));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// unDislike Main Post
module.exports.unDisLikeComment = (event, context, callback) => {
  const videoID = event.pathParameters.videoID;
  const creatSort = event.pathParameters.creatSort;

  const params = {
    Key: {
      videoID: videoID,
      creatSort: parseInt(creatSort),
    },
    TableName: postsTable,
    //ConditionExpression: "attribute_exists(id)",
    UpdateExpression:
      "SET reviews.disLikes = reviews.disLikes - :val, trend = trend + :dateNow",
    ExpressionAttributeValues: {
      ":val": 1,
      ":dateNow": parseInt(Date.parse(new Date().toISOString())),
    },
    //ReturnValues: "UPDATED_NEW",
    ReturnValues: "ALL_NEW",
  };
  console.log("Updating");

  return db
    .update(params)
    .promise()
    .then((res) => {
      //console.log(res);
      callback(null, response(200, res.Attributes));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// Delete a main comment
module.exports.deleteMainComment = (event, context, callback) => {
  const videoID = event.pathParameters.videoID;
  const creatSort = event.pathParameters.creatSort;

  const params = {
    Key: {
      videoID: videoID,
      creatSort: parseInt(creatSort),
    },
    TableName: postsTable,
  };

  return db
    .delete(params)
    .promise()
    .then(() =>
      callback(null, response(200, { message: "Comment deleted successfully" }))
    )
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// Adding replies to main comment
module.exports.replyToMainComment = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);
  const rand = getRandomInt(10);

  const videoID = event.pathParameters.videoID;
  const creatSort = event.pathParameters.creatSort;

  const post = {
    id: uuidv4(),
    profilePicture: reqBody.profilePicture,
    user: {
      firstName: reqBody.user.firstName,
      lastName: reqBody.user.lastName,
    },
    creatSort: Date.parse(new Date().toISOString()) + rand,
    createdAt: new Date().toISOString(),
    body: reqBody.body,
  };

  const params = {
    Key: {
      videoID: videoID,
      creatSort: parseInt(creatSort),
    },
    TableName: postsTable,
    //ConditionExpression: "attribute_exists(id)",
    UpdateExpression:
      "SET #r = list_append(#r, :vals), numberOfReplies = numberOfReplies + :addNUm",
    ExpressionAttributeNames: { "#r": "replies" },
    ExpressionAttributeValues: {
      ":vals": [post],
      ":addNUm": 1,
    },
    //ReturnValues: "UPDATED_NEW",
    ReturnValues: "ALL_NEW",
  };
  console.log("Updating");

  return db
    .update(params)
    .promise()
    .then((res) => {
      //console.log(res);
      callback(null, response(200, res.Attributes));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};
