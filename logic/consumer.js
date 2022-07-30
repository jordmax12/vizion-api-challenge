const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2",
});

const { Consumer } = require("sqs-consumer");
const { referenceListener } = require("../controllers/reference");
const { QUEUE_URL } = require("../helpers/constants");

const consumer = Consumer.create({
  queueUrl: QUEUE_URL,
  handleMessage: async (message) => referenceListener(message),
  messageAttributeNames: ["url", "id", "created_at"],
  sqs: new AWS.SQS(),
});

consumer.on("error", (err) => {
  console.error(err.message);
});

consumer.on("processing_error", (err) => {
  console.error(err.message);
});

console.log("\n\n Consumer service is running \n\n");
consumer.start();

module.exports = consumer;
