const equipementService = require('../services/equipementService');
const asyncHandler = require('../utils/asyncHandler');

// Récupérer tous les équipements
const getAllEquipements = asyncHandler(async (req, res) => {
    const equipements = await equipementService.getAllEquipements();
    res.status(200).json(equipements);
});

// Récupérer les détails d'un équipement
const getEquipementDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const equipement = await equipementService.getEquipementById(id);
    res.status(200).json(equipement);
});

// créée un nouvel équipement
const createEquipement = asyncHandler(async (req, res) => {
    const equipementId = await equipementService.createEquipement(req.body);
    res.status(201).json({ id: equipementId, message: "equipement cree avec succes" });
});

// modification d'un équipement
const updateEquipement = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await equipementService.updateEquipement(id, req.body);
    res.status(200).json({ message: "equipement mis a jour avec succes" });
});

// suppression d'un équipement
const deleteEquipement = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await equipementService.deleteEquipement(id);
    res.status(200).json({ message: "equipement supprime avec succes" });
});


module.exports = {
    getAllEquipements,
    getEquipementDetails,
    createEquipement,
    updateEquipement,
    deleteEquipement
};
 
   

 