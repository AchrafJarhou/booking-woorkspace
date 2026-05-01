const { body } = require('express-validator');

// Validations pour la création d'une réservation
const validateCreateReservation = [
    body('salle_id').isInt().withMessage('salle_id doit être un entier'),
    body('date').isDate().withMessage('date invalide (format: YYYY-MM-DD)'),
    body('heure_debut').matches(/^\d{2}:\d{2}$/).withMessage('heure_debut invalide (format: HH:mm)'),
    body('heure_fin').matches(/^\d{2}:\d{2}$/).withMessage('heure_fin invalide (format: HH:mm)'),
    body('type_reservation').isIn(['heure', 'demi-journee', 'journee']).withMessage('type_reservation invalide (heure|demi-journee|journee)'),
    // Validation custom: heure_fin > heure_debut
    body().custom((value, { req }) => {
        if (req.body.heure_fin <= req.body.heure_debut) {
            throw new Error('heure_fin doit etre apres heure_debut');
        }
        return true;
    })
];

module.exports = {
    validateCreateReservation
};
