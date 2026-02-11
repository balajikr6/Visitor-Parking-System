'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await queryInterface.bulkInsert('users', [{
            name: 'Admin User',
            email: 'admin@parking.com',
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', { email: 'admin@parking.com' }, {});
    }
};
