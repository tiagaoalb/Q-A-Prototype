'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Page.init(
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
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        sub_title: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: '',
        },
      },
      {
        sequelize,
        timestamps: true,
        modelName: 'Page',
        tableName: 'Pages',
      },
  );
  return Page;
};
