const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class BlacklistedToken extends Model { }

BlacklistedToken.init({
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'BlacklistedToken',
    tableName: 'blacklisted_tokens',
    timestamps: true
});

module.exports = BlacklistedToken;
