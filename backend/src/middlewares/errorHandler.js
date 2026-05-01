const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    if (!err.isOperational && statusCode === 500) {
        console.error('UNEXPECTED ERROR:', err);
    }

    res.status(statusCode).json({
        status,
        message: err.message || 'Erreur interne du serveur'
    });
};

const notFoundHandler = (req, res, next) => {
    next(new AppError(`Route introuvable: ${req.originalUrl}`, 404));
};

module.exports = {
    errorHandler,
    notFoundHandler
};
