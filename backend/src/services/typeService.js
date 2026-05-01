const Type = require('../models/Type');
const AppError = require('../utils/AppError');

const getAllTypes = async () => {
    return Type.findAll();
};

const getTypeById = async (id) => {
    const type = await Type.findById(id);

    if (!type) {
        throw new AppError('Type introuvable', 404);
    }

    return type;
};

const createType = async (data) => {
    return Type.create(data);
};

const updateType = async (id, data) => {
    const updated = await Type.update(id, data);

    if (!updated) {
        throw new AppError('Type introuvable', 404);
    }
};

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
