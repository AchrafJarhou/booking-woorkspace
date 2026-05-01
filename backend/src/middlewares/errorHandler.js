const AppError = require('../utils/AppError');

// Middleware centralisé pour gérer toutes les erreurs de l'application.
// Les erreurs "opérationnelles" (AppError) renvoient un message clair au client.
// Les erreurs inattendues sont loggées et renvoient un message générique.
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    if (!err.isOperational && statusCode === 500) {
        // Erreurs non prévues: log pour debug côté serveur
        console.error('UNEXPECTED ERROR:', err);
    }

    res.status(statusCode).json({
        status,
        message: err.message || 'Erreur interne du serveur'
    });
};

// Handler pour routes non définies -> renvoie un AppError 404
const notFoundHandler = (req, res, next) => {
    next(new AppError(`Route introuvable: ${req.originalUrl}`, 404));
};

module.exports = {
    errorHandler,
    notFoundHandler
};
