'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('visitors', 'exit_time', {
            type: Sequelize.TIME,
            allowNull: true
        });
        
        await queryInterface.addColumn('visitors', 'exit_gate', {
            type: Sequelize.STRING,
            allowNull: true
        });
        
        await queryInterface.addColumn('visitors', 'notes', {
            type: Sequelize.TEXT,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('visitors', 'exit_time');
        await queryInterface.removeColumn('visitors', 'exit_gate');
        await queryInterface.removeColumn('visitors', 'notes');
    }
};
