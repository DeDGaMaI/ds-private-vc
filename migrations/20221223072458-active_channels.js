'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('active_channels', {
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
			channel_id: {
				type: Sequelize.BIGINT,
				allowNull: false,
			},
			parent_id: {
				type: Sequelize.BIGINT,
				allowNull: true,
			},
			owner_id: {
				type: Sequelize.BIGINT,
				allowNull: false,
				unique: true,
			},
			type: {
				type: Sequelize.ENUM('teamplay', 'communicate'),
			},
			related_voice_channel_id: {
				type: Sequelize.BIGINT,
			},
			related_message_id: {
				type: Sequelize.BIGINT,
			},
			createdAt: Sequelize.DATE,
			updatedAt: Sequelize.DATE,
		});
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
