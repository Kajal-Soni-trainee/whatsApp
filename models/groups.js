'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      groups.hasMany(models.group_msg, { foreignKey: 'group_id' });
    }
  }
  groups.init({
    group_name: DataTypes.STRING,
    created_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'groups',
    paranoid: true
  });
  return groups;
};