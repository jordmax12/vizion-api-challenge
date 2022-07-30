const db = require("../models");

const Reference = db.references;
/**
 * Helper function to create a Reference in our database.
 * @param {String} url URL we want to create a reference with.
 * @returns Result of the sequelize `create` method on a model.
 */
const create = (url) =>
  new Promise((resolve) => {
    const reference = {
      url,
      created_at: new Date().toISOString(),
    };

    Reference.create(reference)
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
 * Helper function to delete or destroy a Reference by id.
 * @param {Integer} id Reference id you wish to delete.
 * @returns true or false depending on successful or not.
 */
const destroy = (id) =>
  new Promise((resolve) => {
    Reference.destroy({
      where: {
        id,
      },
    })
      .then(() => resolve(true))
      .catch((e) => {
        console.error(e);
        resolve(false);
      });
  });
/**
 * Helper function to find a Reference by the primary key.
 * @param {Integer} id id representing the primary key for a reference in our database.
 * @returns Result of the sequelize `findByPk` method on a model.
 */
const findOne = (id) =>
  new Promise((resolve) => {
    Reference.findByPk(id)
      .then((data) => {
        if (data) {
          resolve({
            data: data.dataValues,
          });
        } else {
          resolve({
            name: "Error",
            message: `Cannot find reference with id: ${id}`,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        resolve({
          name: err.name,
          message: `Error retrieving reference with id: ${id}. ${err.message}`,
          stack: err.stack,
        });
      });
  });

module.exports = {
  create,
  destroy,
  findOne,
};
