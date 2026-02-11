const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const AppError = require('../utils/AppError');

class Visitor extends Model { }

Visitor.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    plate_number: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('plate_number', value.toUpperCase().replace(/\s/g, ''));
        }
    },
    visit_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    entry_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    entry_gate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    visitor_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    purpose: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicle_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('ENTERED', 'EXITED', 'CANCELLED'),
        defaultValue: 'ENTERED'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    exit_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    exit_gate: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Visitor',
    tableName: 'visitors',
    paranoid: true, // Soft delete
    hooks: {
        beforeValidate: (visitor) => {
            if (!visitor.entry_time) {
                const now = new Date();
                visitor.entry_time = now.toTimeString().split(' ')[0];
            }
        },
        beforeCreate: async (visitor) => {
            // Check for active ENTERED record
            const existing = await Visitor.findOne({
                where: {
                    plate_number: visitor.plate_number,
                    visit_date: visitor.visit_date,
                    status: 'ENTERED'
                }
            });
            if (existing) {
                throw new AppError('Vehicle already has an active entry for today.', 400);
            }
        }
    }
});

module.exports = Visitor;
