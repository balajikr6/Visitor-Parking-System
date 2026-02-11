const authService = require('../services/authService');
const sendEmail = require('../utils/email');
const AppError = require('../utils/AppError');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        const { user, accessToken, refreshToken } = await authService.login(email, password);

        // Send login notification
        await sendEmail({
            email: user.email,
            subject: 'Login Notification',
            message: `Hello ${user.name},\n\nYou have successfully logged in to the Visitor Parking System.`
        });

        // Set access token cookie (20 mins)
        res.cookie('jwt', accessToken, {
            expires: new Date(Date.now() + 20 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        // Set refresh token cookie (7 days)
        res.cookie('refreshToken', refreshToken, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({
            status: 'success',
            accessToken,
            refreshToken,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: requestToken } = req.body;

        if (!requestToken) {
            return next(new AppError('Refresh Token is required!', 403));
        }

        const { accessToken, refreshToken } = await authService.verifyRefreshToken(requestToken);

        // Update access token cookie
        res.cookie('jwt', accessToken, {
            expires: new Date(Date.now() + 15 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({
            status: 'success',
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        let accessToken;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            accessToken = req.headers.authorization.split(' ')[1];
        }

        await authService.logout(refreshToken, accessToken);

        // Clear cookies
        res.cookie('jwt', 'loggedout', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });
        res.cookie('refreshToken', 'loggedout', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        next(error);
    }
};
