'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.hasMany(models.contact_lists, { foreignKey: 'contact_id' }),
      users.hasMany(models.contact_lists, { foreignKey: "contact_person_id" });
      users.hasMany(models.group_msg, { foreignKey: 'sender_id' });
    }
  }
  users.init({
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.BIGINT,
    salt: DataTypes.STRING,
    password: DataTypes.STRING,
    lastSeen: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'users',
    paranoid: true,
  });
  return users;
};