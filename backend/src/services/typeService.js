// Services pour les types de salles
const Type = require('../models/Type');
const AppError = require('../utils/AppError');

// Retourne tous les types
const getAllTypes = async () => {
    return Type.findAll();
};

// Récupère un type ou lève 404
const getTypeById = async (id) => {
    const type = await Type.findById(id);

    if (!type) {
        throw new AppError('Type introuvable', 404);
    }

    return type;
};

// Crée un nouveau type
const createType = async (data) => {
    return Type.create(data);
};

// Met à jour un type
const updateType = async (id, data) => {
    const updated = await Type.update(id, data);

    if (!updated) {
        throw new AppError('Type introuvable', 404);
    }
};

// Supprime un type
const deleteType = async (id) => {
    const deleted = await Type.delete(id);

    if (!deleted) {
        throw new AppError('Type introuvable', 404);
    }
};

module.exports = {
    getAllTypes,
    getTypeById,
    createType,
    updateType,
    deleteType
};
