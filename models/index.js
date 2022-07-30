const Sequelize = require("sequelize");
const { sequelize: sequelizeConfig } = require("../config/default.json");

const sequelize = new Sequelize(
  sequelizeConfig.DB,
  sequelizeConfig.USER,
  sequelizeConfig.PASSWORD,
  {
    host: sequelizeConfig.HOST,
    dialect: sequelizeConfig.dialect,
    pool: {
      max: sequelizeConfig.pool.max,
      min: sequelizeConfig.pool.min,
      acquire: sequelizeConfig.pool.acquire,
      idle: sequelizeConfig.pool.idle,
    },
    logging: false,
  }
);

const Reference = require("./reference")(sequelize, Sequelize);

Reference.afterCreate(async ({ dataValues: newImage }) => {
  // eslint-disable-next-line global-require
  const { afterCreate } = require("../controllers/reference");
  console.log("New Reference Created");
  const { id, url, created_at: createdAt } = newImage;
  return afterCreate(id, url, createdAt);
});

const Result = require("./result")(sequelize, Sequelize);

Result.belongsTo(Reference, { foreignKey: "reference_id", as: "reference" });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.references = Reference;
db.results = Result;

module.exports = db;
