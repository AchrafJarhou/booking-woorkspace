// Controller léger pour les équipements.
// Les controllers reçoivent la requête, appellent les services
// et renvoient la réponse HTTP. La logique métier est dans les services.
const equipementService = require('../services/equipementService');
const asyncHandler = require('../utils/asyncHandler');

// Récupérer tous les équipements
// GET /api/equipements
// Renvoie la liste complète des équipements
const getAllEquipements = asyncHandler(async (req, res) => {
    const equipements = await equipementService.getAllEquipements();
    res.status(200).json(equipements);
});

// Récupérer les détails d'un équipement
// GET /api/equipements/:id
// Récupère le détail d'un équipement ou lance une AppError(404)
const getEquipementDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const equipement = await equipementService.getEquipementById(id);
    res.status(200).json(equipement);
});

// créée un nouvel équipement
// POST /api/equipements
// Crée un équipement et renvoie l'ID créé
const createEquipement = asyncHandler(async (req, res) => {
    const equipementId = await equipementService.createEquipement(req.body);
    res.status(201).json({ id: equipementId, message: "equipement cree avec succes" });
});

// modification d'un équipement
// PUT /api/equipements/:id
// Met à jour un équipement existant
const updateEquipement = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await equipementService.updateEquipement(id, req.body);
    res.status(200).json({ message: "equipement mis a jour avec succes" });
});

// suppression d'un équipement
// DELETE /api/equipements/:id
// Supprime un équipement
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
 
   

 