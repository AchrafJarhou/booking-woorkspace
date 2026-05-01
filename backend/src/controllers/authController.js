// Controller pour l'authentification (register, login, me)
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/auth/register
// Inscription d'un nouvel utilisateur
const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
});

// POST /api/auth/login
// Connexion d'un utilisateur
const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.status(200).json(result);
});

// GET /api/auth/me
// Retourne le profil de l'utilisateur connecté
const me = asyncHandler(async (req, res) => {
    // L'utilisateur est déjà authentifié via le middleware authRequired
    res.status(200).json({
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.role
    });
});

module.exports = {
    register,
    login,
    me
};
