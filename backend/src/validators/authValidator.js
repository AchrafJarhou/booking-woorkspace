const { body } = require('express-validator');

// Validations pour l'inscription (register)
const validateRegister = [
    body('nom').notEmpty().withMessage('Le nom est obligatoire'),
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

// Validations pour la connexion (login)
const validateLogin = [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Le mot de passe est obligatoire')
];

module.exports = {
    validateRegister,
    validateLogin
};
