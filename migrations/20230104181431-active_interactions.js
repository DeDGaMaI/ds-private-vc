'use strict';

const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('active_interactions', {
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
			},
			type: {
				type: Sequelize.ENUM('command', 'active_channel'),
			},
			interaction_id: {
				type: Sequelize.BIGINT,
				unique: true,
				allowNull: false,
			},
			channel_type: {
				type: Sequelize.ENUM('teamplay', 'communicate'),
			},
			parent_id: {
				type: Sequelize.BIGINT,
			},
			voice_channel_id: {
				type: Sequelize.BIGINT,
			},
			text_channel_id: {
				type: Sequelize.BIGINT,
			},
			channel_size: {
				type: Sequelize.INTEGER,
			},
			active_parent_id: {
				type: Sequelize.BIGINT,
			},
			owner_id: {
				type: Sequelize.BIGINT,
			},
			name: {
				type: Sequelize.STRING,
				unique: true,
			},
			status: {
				type: Sequelize.STRING
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
