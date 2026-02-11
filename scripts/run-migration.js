require('dotenv').config();
const sequelize = require('../src/config/db');

async function runMigration() {
    try {
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS blacklisted_tokens (
                id SERIAL PRIMARY KEY,
                token VARCHAR(255) NOT NULL UNIQUE,
                "expiryDate" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);
        console.log('blacklisted_tokens table created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();
