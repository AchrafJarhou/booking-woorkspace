const Equipement = require('../models/Equipements');
const AppError = require('../utils/AppError');

const getAllEquipements = async () => {
    return Equipement.findAll();
};

const getEquipementById = async (id) => {
    const equipement = await Equipement.findById(id);

    if (!equipement) {
        throw new AppError('Equipement introuvable', 404);
    }

    return equipement;
};

const createEquipement = async (data) => {
    return Equipement.create(data);
};

const updateEquipement = async (id, data) => {
    const updated = await Equipement.update(id, data);

    if (!updated) {
        throw new AppError('Equipement introuvable', 404);
    }
};

const deleteEquipement = async (id) => {
    const deleted = await Equipement.delete(id);

    if (!deleted) {
        throw new AppError('Equipement introuvable', 404);
    }
};

module.exports = {
    getAllEquipements,
    getEquipementById,
    createEquipement,
    updateEquipement,
    deleteEquipement
};
