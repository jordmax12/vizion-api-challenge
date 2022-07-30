const db = require("../models");

const Result = db.results;
/**
 * Helper function to create a result in the db.
 * @param {Object} result Result object you wish to create.
 * @returns Result of the sequelize `create` method on a model.
 */
const create = (result) =>
  new Promise((resolve) => {
    Result.create(result)
      .then(({ dataValues }) => {
        resolve({ data: dataValues });
      })
      .catch((err) => {
        console.error(err);
        resolve({
          name: err.name,
          message: err.message,
          stack: err.stack,
        });
      });
  });
/**
 * Helper function to delete all results by reference id.
 * @param {Integer} referenceId Id of the reference we want to use to delete all results with.
 * @returns true or false depending on if successful.
 */
const deleteAllResultsByReferenceId = async (referenceId) =>
  new Promise((resolve) => {
    Result.destroy({
      where: {
        reference_id: referenceId,
      },
    })
      .then(() => resolve(true))
      .catch((err) => {
        console.error(err);
        resolve(false);
      });
  });
/**
 * Helper function to retrieve a list of results by a given reference id.
 * @param {Integer} referenceId Id of the reference we want to use to search for results.
 * @returns List of results that contain the given reference id.
 */
const findAllByReferenceId = async (referenceId) =>
  new Promise((resolve) => {
    Result.findAll({
      where: {
        reference_id: referenceId,
      },
      include: "reference",
    })
      .then((rows) => {
        if (rows) {
          resolve(rows.map((r) => r.dataValues));
        } else {
          resolve({
            name: "Error",
            error: `Cannot find results by reference id: ${referenceId}`,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        resolve({
          name: "Error",
          message: `Error retrieving esults by reference id: ${referenceId}`,
        });
      });
  });
/**
 * Helper function to find a Result by the primary key.
 * @param {Integer} id id representing the primary key for a result in our database.
 * @returns Result of the sequelize `findByPk` method on a model.
 */
const findOne = (id) =>
  new Promise((resolve) => {
    Result.findByPk(id)
      .then((data) => {
        if (data) {
          resolve({ data: data.dataValues });
        } else {
          resolve({
            name: "Error",
            message: `Cannot find result with id: ${id}`,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        resolve({
          name: "Error",
          message: `Error retrieving result with id: ${id}`,
        });
      });
  });
/**
 * Helper function to update a Result in the database.
 * @param {Integer} id id representing the primary key for a reference in our database.
 * @param {Object} result Result object that we are updating to.
 * @returns Result of the sequelize 'update' method on a model.
 */
const update = (id, result) =>
  new Promise((resolve) => {
    Result.update(result, {
      where: { id },
    })
      .then(() => {
        resolve({ data: { ...result, id } });
      })
      .catch((err) => {
        console.error(err);
        resolve({
          name: err.name,
          message: err.message,
          stack: err.stack,
        });
      });
  });

module.exports = {
  create,
  deleteAllResultsByReferenceId,
  findAllByReferenceId,
  findOne,
  update,
};
