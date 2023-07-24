'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users_punishments', {
      guild_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
      },
      voice_channel_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      target_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      initiator_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      punishment_type: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
