'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
  //   queryInterface.addColumn('messages',
  //     'isSeen', {
  //     type: Sequelize.DataTypes.BOOLEAN
  //   });
  //   queryInterface.addColumn('messages', 'deleted_by', {
  //     type: Sequelize.DataTypes.INTEGER,
  //     defaultValue: null,
  //     references: {
  //       model: 'users',
  //       key: "id"
  //     },
  //   });
    // queryInterface.addColumn('group_msgs',
    //   'isSeen', {
    //   type: Sequelize.DataTypes.BOOLEAN
    // });
    // queryInterface.addColumn('group_msgs', 'deleted_by', {
    //   type: Sequelize.DataTypes.INTEGER,
    //   defaultValue: null,
    //   references: {
    //     model: 'users',
    //     key: "id"
    //   },
    // });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
