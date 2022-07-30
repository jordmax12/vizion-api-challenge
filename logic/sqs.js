const { SQS } = require("aws-sdk");

const queue = new SQS({
  endpoint: "http://localhost:9324",
  region: "us-east-2",
});
/**
 * Helper function to generate a default SQS body.
 * @returns Default body we can send to SQS.
 */
const defaultMessagebody = () =>
  `This is a SQS message sent at ${new Date().toISOString()}`;
/**
 * Helper function to send a message to SQS.
 * @param {String} queueUrl Queue URL of the Queue we want to send a message to.
 * @param {Array} messageAttributes Array of SQS formatted message attributes.
 * @param {String} messageBody Body of the message we want to send a message with.
 * @returns Result of the send message AWS SDK call.
 */
const sendMessage = async (
  queueUrl,
  messageAttributes,
  messageBody = defaultMessagebody()
) => {
  const params = {
    MessageAttributes: messageAttributes,
    MessageBody: messageBody,
    QueueUrl: queueUrl,
  };

  return queue.sendMessage(params).promise();
};

module.exports = {
  sendMessage,
};
