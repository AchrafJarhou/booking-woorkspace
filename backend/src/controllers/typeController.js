const Type = require('../models/Type');

// Récupérer tous les types
const getAllTypes = async (req, res) => {
    try {
        const types = await Type.findAll();
        res.status(200).json(types);
    } catch (error) {
        console.error("ERREUR SQL :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des types" });
    }
};

// Récupérer les détails d'un type
const getTypeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const type = await Type.findById(id);

        if (!type) {
            return res.status(404).json({ message: "type introuvable" });
        }

        res.status(200).json(type);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des détails" });
    }
};

// créée un nouvel type
const createType = async (req, res) => {
    try {
        const typeId = await Type.create(req.body);
        res.status(201).json({ id: typeId, message: "type créé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de l'type" });
    }
};

// modification d'un type
const updateType = async (req, res) => {
    try {
        const { id } = req.params;
        await Type.update(id, req.body);
        res.status(200).json({ message: "type mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'type" });
    }
};

// suppression d'un type
const deleteType = async (req, res) => {
    try {
        const { id } = req.params;
        await Type.delete(id);
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
};


module.exports = {
    getAllTypes,
    getTypeDetails,
    createType,
    updateType,
    deleteType
};
 
   

 