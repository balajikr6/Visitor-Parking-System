const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/AppError');
const authRouter = require('./routes/authRoutes');
const visitorRouter = require('./routes/visitorRoutes');
const { isLoggedIn, protect } = require('./middleware/authMiddleware');

const app = express();

// Middlewares
app.use(helmet()); // Basic security
// Helmet content security policy needs adjustment for CDN scripts/styles if strict
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        fontSrc: ["'self'", "cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:"]
    },
}));

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// API Routes
app.use('/api/auth', authRouter);
app.use('/api/visitors', visitorRouter);

// UI Routes
app.get('/', isLoggedIn, (req, res) => {
    if (res.locals.user) {
        return res.redirect('/dashboard');
    }
    res.render('login');
});

app.get('/dashboard', protect, (req, res) => {
    res.render('dashboard', { user: res.locals.user });
});

// 404
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // API error
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    // Render Error Page (simple fallback)
    res.status(err.statusCode).send(`<h1>${err.status.toUpperCase()}</h1><p>${err.message}</p>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
