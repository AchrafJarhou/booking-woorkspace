const User = require('../models/User');
const AppError = require('../utils/AppError');

const getAllUsers = async () => {
    return User.findAll();
};

const getUserById = async (id) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError('Utilisateur introuvable', 404);
    }

    return user;
};

const createUser = async (data) => {
    return User.create(data);
};

const updateUser = async (id, data) => {
    const updated = await User.update(id, data);

    if (!updated) {
        throw new AppError('Utilisateur introuvable', 404);
    }
};

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
