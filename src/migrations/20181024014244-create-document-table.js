'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Document', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_at: {
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('Document');

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
