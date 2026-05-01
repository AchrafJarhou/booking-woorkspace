const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { validateCreateRoom, validateUpdateRoom } = require('../validators/roomValidator');
const validateRequest = require('../middlewares/validateRequest');
const { authRequired, requireRole } = require('../middlewares/auth');

// Route pour récupérer toutes les salles
// URL : GET http://localhost:3000/api/rooms/
router.get('/', roomController.getAllRooms);

// Route pour récupérer les salles disponibles à une date
// URL : GET http://localhost:3000/api/rooms/available?date=2026-05-15&ville=Paris&capacite_min=10&type_id=2
router.get('/available', roomController.getAvailableRooms);

// Route pour récupérer une salle précise (avec photos et équipements)
// URL : GET http://localhost:3000/api/rooms/1
router.get('/:id', roomController.getRoomDetails);

// Route pour créer une salle (Admin)
// URL : POST http://localhost:3000/api/rooms/
router.post('/', authRequired, requireRole('admin'), validateCreateRoom, validateRequest, roomController.createRoom);

// Route pour mettre à jour une salle
// URL : PUT http://localhost:3000/api/rooms/:id
router.put('/:id', authRequired, requireRole('admin'), validateUpdateRoom, validateRequest, roomController.updateRoom);

// Route pour supprimer une salle
// URL : DELETE http://localhost:3000/api/rooms/:id
router.delete('/:id', authRequired, requireRole('admin'), roomController.deleteRoom);

module.exports = router;