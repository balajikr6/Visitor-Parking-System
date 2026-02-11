'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('visitors', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            plate_number: {
                type: Sequelize.STRING,
                allowNull: false
            },
            visit_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            entry_time: {
                type: Sequelize.TIME,
                allowNull: false
            },
            entry_gate: {
                type: Sequelize.STRING,
                allowNull: false
            },
            visitor_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            mobile_number: {
                type: Sequelize.STRING,
                allowNull: false
            },
            purpose: {
                type: Sequelize.STRING,
                allowNull: false
            },
            vehicle_type: {
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('ENTERED', 'EXITED', 'CANCELLED'),
                defaultValue: 'ENTERED'
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            exit_time: {
                type: Sequelize.TIME,
                allowNull: true
            },
            exit_gate: {
                type: Sequelize.STRING,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                type: Sequelize.DATE
            }
        });

        // Add indexes
        await queryInterface.addIndex('visitors', ['plate_number']);
        await queryInterface.addIndex('visitors', ['visit_date']);
        await queryInterface.addIndex('visitors', ['entry_gate']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('visitors');
    }
};
