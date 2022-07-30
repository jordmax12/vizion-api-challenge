const {
  create,
  deleteAllResultsByReferenceId,
  findAllByReferenceId,
  findOne,
  update,
} = require("../logic/result");
const { RESULT_STATES } = require("../helpers/constants");

/**
 * Entry function to create a Result in our database.
 * @param {Object} data data from the scrape.
 * @param {Integer} referenceId id of the reference we are scraping.
 * @param {String} status Status enum value.
 * @returns Result of create method in result logic.
 */
const createResult = async (data, referenceId, status) => {
  const result = {
    data,
    reference_id: referenceId,
    status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return create(result);
};
/**
 * Entry function to find a result by id.
 * @param {Integer} id ID of the result you wish to query.
 * @returns Object with `data` and `error` properties.
 */
const findResult = async (id) => findOne(id);
/**
 * Helper function to delete all results by reference id.
 * @param {Integer} referenceId Id of the reference you want to delete against.
 * @returns true or false depending on successful.
 */
const deleteResultsByReferenceId = async (referenceId) =>
  deleteAllResultsByReferenceId(referenceId);
/**
 * Helper function to get all results by reference id.
 * @param {Integer} referenceId Id of the reference you want to delete against.
 * @returns List of results that match query.
 */
const getAllResultsByReferenceId = async (referenceId) =>
  findAllByReferenceId(referenceId);
/**
 * Entry function to update a Result.
 * @param {Object} param0 Object containing `data` and `error` from the scrape process.
 * @param {Object} initialResult The Result data from DB pre-process.
 * @returns Response from the update call to DB.
 */
const updateResultPostProcess = async ({ error, data }, initialResult) => {
  let result;
  if (error) {
    result = {
      ...initialResult,
      status: RESULT_STATES.ERROR,
      error,
      updated_at: new Date().toISOString(),
    };
  } else {
    result = {
      ...initialResult,
      data,
      status: RESULT_STATES.SUCCESS,
      updated_at: new Date().toISOString(),
    };
  }

  return update(result.id, result);
};

module.exports = {
  createResult,
  deleteResultsByReferenceId,
  findResult,
  getAllResultsByReferenceId,
  updateResultPostProcess,
};
