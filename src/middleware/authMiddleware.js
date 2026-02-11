const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const authService = require('../services/authService');

exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // Get token from header or cookie
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            if (req.originalUrl.startsWith('/api')) {
                return next(new AppError('You are not logged in! Please log in to get access.', 401));
            }
            return res.redirect('/');
        }

        // Check if token is blacklisted
        if (await authService.isTokenBlacklisted(token)) {
            if (req.originalUrl.startsWith('/api')) {
                return next(new AppError('This token has been revoked. Please log in again.', 401));
            }
            return res.redirect('/');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists
        const currentUser = await User.findByPk(decoded.id);
        if (!currentUser) {
            if (req.originalUrl.startsWith('/api')) {
                return next(new AppError('The user belonging to this token does no longer exist.', 401));
            }
            return res.redirect('/');
        }

        req.user = currentUser;
        res.locals.user = currentUser;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        if (req.originalUrl.startsWith('/api')) {
            return next(new AppError('Invalid token. Please log in again!', 401));
        }
        return res.redirect('/');
    }
};

// For pages - doesn't throw error if not logged in
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
            const currentUser = await User.findByPk(decoded.id);

            if (currentUser) {
                res.locals.user = currentUser;
            }
        } catch (err) {
            // token invalid - continue
        }
    }
    next();
};
