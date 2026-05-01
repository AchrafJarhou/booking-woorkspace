// Services pour les équipements.
// Contiennent la logique métier et lèvent des AppError en cas d'anomalie.
const Equipement = require('../models/Equipements');
const AppError = require('../utils/AppError');

// Retourne la liste de tous les équipements (promise)
const getAllEquipements = async () => {
    return Equipement.findAll();
};

// Récupère un équipement, lance AppError(404) si introuvable
const getEquipementById = async (id) => {
    const equipement = await Equipement.findById(id);

    if (!equipement) {
        throw new AppError('Equipement introuvable', 404);
    }

    return equipement;
};

// Crée un nouvel équipement
const createEquipement = async (data) => {
    return Equipement.create(data);
};

// Met à jour un équipement, lève 404 si l'id n'existe pas
const updateEquipement = async (id, data) => {
    const updated = await Equipement.update(id, data);

    if (!updated) {
        throw new AppError('Equipement introuvable', 404);
    }
};

// Supprime un équipement
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
