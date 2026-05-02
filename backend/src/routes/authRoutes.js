const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const validateRequest = require('../middlewares/validateRequest');
const { authRequired } = require('../middlewares/auth');

// POST /api/auth/register
// Inscription d'un nouvel utilisateur
router.post('/register', validateRegister, validateRequest, authController.register);

// POST /api/auth/login
// Connexion d'un utilisateur
router.post('/login', validateLogin, validateRequest, authController.login);

// GET /api/auth/me
// Récupère le profil de l'utilisateur connecté
router.get('/me', authRequired, authController.me);

// POST /api/auth/logout
// Déconnexion: supprime le cookie token
router.post('/logout', authRequired, authController.logout);

module.exports = router;
