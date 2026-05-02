// Controller pour l'authentification (register, login, me)
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/auth/register
// Inscription d'un nouvel utilisateur
const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    // Pas de token à l'inscription
    res.status(201).json({
        userId: result.userId,
        email: result.email,
        nom: result.nom,
        role: result.role
    });
});

// POST /api/auth/login
// Connexion d'un utilisateur
const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    
    // Envoyer le token en HttpOnly Cookie
    res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 jours
    });
    
    // Retourner user sans le token
    res.status(200).json({
        userId: result.userId,
        email: result.email,
        nom: result.nom,
        role: result.role
    });
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
