'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.createTable('servers', {
			name: {
				allowNull: false,
				type: Sequelize.STRING
			},
			id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				unique: true,
				primaryKey: true,
				autoIncrement: true,
			},
			guild_id: {
				type: Sequelize.BIGINT,
				unique: true,
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
