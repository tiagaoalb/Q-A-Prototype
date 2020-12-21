'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class page extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  page.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        uuid: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: true,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: 'page',
      },
  );
  return page;
};
