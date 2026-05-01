const express = require('express');
const router = express.Router();
const equipementController = require('../controllers/equipementController');
const { authRequired, requireRole } = require('../middlewares/auth');

// Route pour récupérer tous les équipements
// URL : GET http://localhost:3000/api/equipements/
router.get('/', equipementController.getAllEquipements);

// Route pour récupérer les détails d'un équipement
// URL : GET http://localhost:3000/api/equipements/1
router.get('/:id', equipementController.getEquipementDetails);

// Route pour créer un équipement
// URL : POST http://localhost:3000/api/equipements/
router.post('/', authRequired, requireRole('admin'), equipementController.createEquipement);

// Route pour modifier un équipement
// URL : PUT http://localhost:3000/api/equipements/1
router.put('/:id', authRequired, requireRole('admin'), equipementController.updateEquipement);

// Route pour supprimer un équipement
// URL : DELETE http://localhost:3000/api/equipements/1
router.delete('/:id', authRequired, requireRole('admin'), equipementController.deleteEquipement);

module.exports = router;
