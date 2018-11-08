'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DocumentVersion', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      document_id: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'Document',
          key: 'id',
        },
      },
      hash: {
        allowNull: false,
        type: Sequelize.STRING,
        // unique: true,
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      tx: {
        type: Sequelize.STRING,
      },
      created_at: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        defaultValue: Sequelize.NOW,
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
