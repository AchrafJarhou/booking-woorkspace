const typeService = require('../services/typeService');
const asyncHandler = require('../utils/asyncHandler');

// Récupérer tous les types
const getAllTypes = asyncHandler(async (req, res) => {
    const types = await typeService.getAllTypes();
    res.status(200).json(types);
});

// Récupérer les détails d'un type
const getTypeDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const type = await typeService.getTypeById(id);
    res.status(200).json(type);
});

// créée un nouvel type
const createType = asyncHandler(async (req, res) => {
    const typeId = await typeService.createType(req.body);
    res.status(201).json({ id: typeId, message: "type cree avec succes" });
});

// modification d'un type
const updateType = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await typeService.updateType(id, req.body);
    res.status(200).json({ message: "type mis a jour avec succes" });
});

// suppression d'un type
const deleteType = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await typeService.deleteType(id);
    res.status(200).json({ message: "type supprime avec succes" });
});


module.exports = {
    getAllTypes,
    getTypeDetails,
    createType,
    updateType,
    deleteType
};
 
   

 