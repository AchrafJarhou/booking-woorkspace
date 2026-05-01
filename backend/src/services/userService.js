// Services utilisateur: hashage, validations métier et opérations CRUD
const User = require('../models/User');
const AppError = require('../utils/AppError');

// Retourne tous les utilisateurs (les données sensibles doivent être filtrées)
const getAllUsers = async () => {
    return User.findAll();
};

// Récupère un utilisateur et lève 404 si introuvable
const getUserById = async (id) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError('Utilisateur introuvable', 404);
    }

    return user;
};

// Crée un utilisateur. Important: le hash du mot de passe à ajouter ici plus tard
const createUser = async (data) => {
    return User.create(data);
};

// Met à jour un utilisateur
const updateUser = async (id, data) => {
    const updated = await User.update(id, data);

    if (!updated) {
        throw new AppError('Utilisateur introuvable', 404);
    }
};

// Supprime un utilisateur
const deleteUser = async (id) => {
    const deleted = await User.delete(id);

    if (!deleted) {
        throw new AppError('Utilisateur introuvable', 404);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
