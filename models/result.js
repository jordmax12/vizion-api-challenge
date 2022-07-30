module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "result",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      reference_id: {
        type: Sequelize.INTEGER,
        references: sequelize.Reference,
        referencesKey: "id",
      },
      data: {
        type: Sequelize.JSON,
      },
      status: {
        type: Sequelize.STRING,
      },
      error: {
        type: Sequelize.JSON,
      },
      created_at: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
