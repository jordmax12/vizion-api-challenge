const RESULT_STATES = {
  IN_PROGRESS: "IN_PROGRESS",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const QUEUE_URL = "http://localhost:9324/000000000000/reference-processor";

module.exports = {
  QUEUE_URL,
  RESULT_STATES,
};
