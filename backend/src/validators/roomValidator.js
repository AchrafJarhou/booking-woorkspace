const { body } = require('express-validator');

// Validations pour la création d'une salle
const validateCreateRoom = [
    body('nom').notEmpty().withMessage('Le nom est obligatoire'),
    body('type_id').isInt().withMessage("Le type_id doit être un entier"),
    body('capacite').optional().isInt({ min: 1 }).withMessage('La capacité doit être un entier positif'),
    body('latitude').notEmpty().withMessage('La latitude est obligatoire').isFloat({ min: -90, max: 90 }).withMessage('Latitude invalide (entre -90 et 90)'),
    body('longitude').notEmpty().withMessage('La longitude est obligatoire').isFloat({ min: -180, max: 180 }).withMessage('Longitude invalide (entre -180 et 180)'),
    body('prix_heure').optional().isFloat().withMessage('prix_heure doit être un nombre'),
    body('prix_demi_journee').optional().isFloat().withMessage('prix_demi_journee doit être un nombre'),
    body('prix_journee').optional().isFloat().withMessage('prix_journee doit être un nombre')
];

// Validations pour la mise à jour d'une salle (champs optionnels mais validés si fournis)
const validateUpdateRoom = [
    body('nom').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
    body('type_id').optional().isInt().withMessage("Le type_id doit être un entier"),
    body('capacite').optional().isInt({ min: 1 }).withMessage('La capacité doit être un entier positif'),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude invalide (entre -90 et 90)'),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('longitude invalide (entre -180 et 180)'),
    body('prix_heure').optional().isFloat().withMessage('prix_heure doit être un nombre'),
    body('prix_demi_journee').optional().isFloat().withMessage('prix_demi_journee doit être un nombre'),
    body('prix_journee').optional().isFloat().withMessage('prix_journee doit être un nombre')
];

module.exports = {
    validateCreateRoom,
    validateUpdateRoom
};
