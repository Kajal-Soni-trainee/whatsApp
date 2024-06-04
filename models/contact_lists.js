'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contact_lists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      contact_lists.belongsTo(models.users, { foreignKey: "id" });
      contact_lists.belongsTo(models.users, { foreignKey: 'id' });
    }
  }
  contact_lists.init({
    contact_id: DataTypes.INTEGER,
    contact_person_id: DataTypes.INTEGER,
    contact_person_name: DataTypes.STRING,
    isBlocked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'contact_lists',
    paranoid: true
  });
  return contact_lists;
};