'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class group_msg extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      group_msg.belongsTo(models.users, { foreignKey: 'sender_id' });
      group_msg.belongsTo(models.groups, { foreignKey: 'group_id' });
    }
  }
  group_msg.init({
    group_id: DataTypes.INTEGER,
    msg_txt: DataTypes.STRING,
    sender_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'group_msg',
    paranoid: true
  });
  return group_msg;
};