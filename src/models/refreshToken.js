const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class RefreshToken extends Model { }

RefreshToken.init({
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
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: true
});

module.exports = RefreshToken;
