const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

// Crée et envoie un JWT
const generateToken = (userId, email, role) => {
    return jwt.sign({ userId, email, role }, process.env.JWT_SECRET || 'secret-key', {
        expiresIn: '7d'
    });
};

// Inscription d'un nouvel utilisateur
const register = async (data) => {
    const { nom, email, password } = data;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        throw new AppError('Cet email est déjà utilisé', 409);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const userId = await User.create({
        nom,
        email,
        password: hashedPassword,
        role: 'user'
    });

    // Générer le token JWT
    const token = generateToken(userId, email, 'user');

    return {
        userId,
        email,
        nom,
        token,
        role: 'user'
    };
};

// Connexion d'un utilisateur
const login = async (data) => {
    const { email, password } = data;

    // Récupérer l'utilisateur par email
    const user = await User.findByEmail(email);
    if (!user) {
        throw new AppError('Email ou mot de passe incorrect', 401);
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError('Email ou mot de passe incorrect', 401);
    }

    // Générer le token JWT
    const token = generateToken(user.id, user.email, user.role);

    return {
        userId: user.id,
        email: user.email,
        nom: user.nom,
        token,
        role: user.role
    };
};

// Vérifier et décoder un JWT
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    } catch (err) {
        throw new AppError('Token invalide ou expiré', 401);
    }
};

module.exports = {
    register,
    login,
    verifyToken,
    generateToken
};
