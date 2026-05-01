// Middlewares pour l'authentification et l'autorisation
const authService = require('../services/authService');
const AppError = require('../utils/AppError');

// Middleware pour vérifier si l'utilisateur est authentifié
const authRequired = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Token manquant ou invalide', 401));
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    try {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        next(err);
    }
};

// Middleware pour vérifier le rôle de l'utilisateur
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('Utilisateur non authentifié', 401));
        }

        if (req.user.role !== role) {
            return next(new AppError('Accès refusé: rôle insuffisant', 403));
        }

        next();
    };
};

module.exports = {
    authRequired,
    requireRole
};
