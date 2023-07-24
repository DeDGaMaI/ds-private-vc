'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('registered_channels', {
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
				unique: true,
			},
			text_channel_id: {
				type: Sequelize.BIGINT,
			},
			parent_id: {
				type: Sequelize.BIGINT,
				allowNull: false,
			},
			active_parent_id: {
				type: Sequelize.BIGINT,
				allowNull: true,
			},
			channel_size: {
				type: Sequelize.INTEGER,
			},
			type: {
				type: Sequelize.ENUM('teamplay', 'communicate'),
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
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
