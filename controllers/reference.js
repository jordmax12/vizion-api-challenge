const { sendMessage } = require("../logic/sqs");
const { create, destroy, findOne } = require("../logic/reference");
const { createResult, updateResultPostProcess } = require("./result");
const { extractMetadataFromUrl } = require("./scraper");
const { QUEUE_URL, RESULT_STATES } = require("../helpers/constants");
/**
 * Helper function to create formatted message attributes for SQS.
 * @param {Integer} id id representing the primary key of a Reference in our database.
 * @param {String} url URL of the Reference.
 * @param {String} createdAt ISO 8601 formatted string.
 * @returns Formatted message attributes that SQS expects.
 */
const referenceCreateMessageAttributes = (id, url, createdAt) => ({
  id: {
    DataType: "Number",
    StringValue: id.toString(),
  },
  url: {
    DataType: "String",
    StringValue: url,
  },
  created_at: {
    DataType: "String",
    StringValue: createdAt,
  },
});
/**
 * Entry function to create a reference.
 * @param {String} url Url you wish to submit to be processed.
 * @returns Object with `data` and `error` properties.
 */
const createReference = async (url) => create(url);
/**
 * Entry function to find a reference.
 * @param {Integer} id ID of the reference you wish to query.
 * @returns Object with `data` and `error` properties.
 */
const findReference = async (id) => findOne(id);
/**
 * Helper function to reprocess a reference.
 * @param {Integer} id ID of the reference you wish to reprocess.
 * @returns Result of send message.
 */
const reprocessReference = async (id) => {
  const { data, error } = await findOne(id);
  if (error) {
    return { error };
  }

  return sendMessage(
    QUEUE_URL,
    referenceCreateMessageAttributes(data.id, data.url, data.created_at)
  );
};
/**
 * Entry function to delete a reference.
 * @param {Integer} id ID of the reference you wish to query.
 * @returns true or false depending on if successful.
 */
const deleteReference = async (id) => destroy(id);
/**
 * Entry function to facilitate the Reference create hook.
 * @param {Integer} id id representing the primary key of a Reference in our database.
 * @param {String} url URL of the Reference.
 * @param {String} createdAt ISO 8601 formatted string.
 * @returns Result of sendMessage command in AWS SDK.
 */
const afterCreate = async (id, url, createdAt) =>
  sendMessage(QUEUE_URL, referenceCreateMessageAttributes(id, url, createdAt));
/**
 * Reference listener function for SQS messages.
 * @param {Object} message Message from SQS.
 * @returns Receipt handle of the SQS message.
 */
const referenceListener = async (message) => {
  console.info({ message });
  const {
    ReceiptHandle: receiptHandle,
    MessageAttributes: {
      id: { StringValue: formattedId },
    },
  } = message;

  const {
    data: { id, url },
  } = await findReference(parseInt(formattedId, 10));
  const { data } = await createResult(null, id, RESULT_STATES.IN_PROGRESS);
  const scrapeMetaData = await extractMetadataFromUrl(url);

  await updateResultPostProcess(scrapeMetaData, data);
  return receiptHandle || true;
};

module.exports = {
  afterCreate,
  createReference,
  deleteReference,
  findReference,
  referenceListener,
  reprocessReference,
};
