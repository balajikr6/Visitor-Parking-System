const User = require('./user');
const Visitor = require('./visitor');
const RefreshToken = require('./refreshToken');
const BlacklistedToken = require('./blacklistedToken');

// Associations
User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

// Visitor associations if needed
// User.hasMany(Visitor, { foreignKey: 'createdBy' });
// Visitor.belongsTo(User, { foreignKey: 'createdBy' });

module.exports = {
    User,
    Visitor,
    RefreshToken,
    BlacklistedToken
};
