const Equipement = require('../models/Equipements');

// Récupérer tous les équipements
const getAllEquipements = async (req, res) => {
    try {
        const equipements = await Equipement.findAll();
        res.status(200).json(equipements);
    } catch (error) {
        console.error("ERREUR SQL :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des équipements" });
    }
};

// Récupérer les détails d'un équipement
const getEquipementDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const equipement = await Equipement.findById(id);

        if (!equipement) {
            return res.status(404).json({ message: "équipement introuvable" });
        }

        res.status(200).json(equipement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des détails" });
    }
};

// créée un nouvel équipement
const createEquipement = async (req, res) => {
    try {
        const equipementId = await Equipement.create(req.body);
        res.status(201).json({ id: equipementId, message: "équipement créé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de l'équipement" });
    }
};

// modification d'un équipement
const updateEquipement = async (req, res) => {
    try {
        const { id } = req.params;
        await Equipement.update(id, req.body);
        res.status(200).json({ message: "équipement mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'équipement" });
    }
};

// suppression d'un équipement
const deleteEquipement = async (req, res) => {
    try {
        const { id } = req.params;
        await Equipement.delete(id);
        res.status(200).json({ message: "équipement supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'équipement" });
    }
};


module.exports = {
    getAllEquipements,
    getEquipementDetails,
    createEquipement,
    updateEquipement,
    deleteEquipement
};
 
   

 