const jwt = require('jsonwebtoken');
const { User, RefreshToken, BlacklistedToken } = require('../models');
const AppError = require('../utils/AppError');
const { v4: uuidv4 } = require('uuid');

class AuthService {
    async login(email, password) {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await user.validatePassword(password))) {
            throw new AppError('Invalid email or password', 401);
        }

        const accessToken = this.generateAccessToken(user);
        const refreshToken = await this.createRefreshToken(user);

        return { user, accessToken, refreshToken };
    }

    async logout(refreshToken, accessToken) {
        if (accessToken) {
            await this.blacklistToken(accessToken);
        }
        if (refreshToken) {
            await RefreshToken.destroy({ where: { token: refreshToken } });
        }
    }

    async blacklistToken(token) {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {
            await BlacklistedToken.create({
                token: token,
                expiryDate: new Date(decoded.exp * 1000)
            });
        }
    }

    async isTokenBlacklisted(token) {
        const blacklisted = await BlacklistedToken.findOne({ where: { token } });
        return !!blacklisted;
    }



    generateAccessToken(user) {
        return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '20m' // Default 20 mins for security
        });
    }

    async createRefreshToken(user) {
        const expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + (7 * 24 * 60 * 60)); // 7 days

        const token = uuidv4();

        await RefreshToken.create({
            token: token,
            userId: user.id,
            expiryDate: expiredAt.getTime()
        });

        return token;
    }

    async verifyRefreshToken(token) {
        const refreshToken = await RefreshToken.findOne({ where: { token } });

        if (!refreshToken) {
            throw new AppError('Refresh token not found', 403);
        }

        if (refreshToken.expiryDate < new Date()) {
            await refreshToken.destroy();
            throw new AppError('Refresh token was expired. Please make a new signin request', 403);
        }

        const user = await User.findByPk(refreshToken.userId);
        const newAccessToken = this.generateAccessToken(user);

        return { accessToken: newAccessToken, refreshToken: refreshToken.token };
    }
}

module.exports = new AuthService();
