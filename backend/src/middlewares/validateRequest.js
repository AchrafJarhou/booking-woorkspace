const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// Middleware pour formater et renvoyer les erreurs de validation
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extracted = errors.array().map(err => ({ field: err.param, message: err.msg }));
        return next(new AppError(JSON.stringify(extracted), 400));
    }
    next();
};

module.exports = validateRequest;
