const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { validateCreateRoom, validateUpdateRoom } = require('../validators/roomValidator');
const validateRequest = require('../middlewares/validateRequest');
const { authRequired, requireRole } = require('../middlewares/auth');

// Route pour récupérer toutes les salles
// URL : GET http://localhost:3000/api/rooms/
router.get('/', roomController.getAllRooms);

// Route pour récupérer une salle précise (avec photos et équipements)
// URL : GET http://localhost:3000/api/rooms/1
router.get('/:id', roomController.getRoomDetails);

// Route pour créer une salle (Admin)
// URL : POST http://localhost:3000/api/rooms/
router.post('/', authRequired, requireRole('admin'), validateCreateRoom, validateRequest, roomController.createRoom);

// Route pour mettre à jour une salle
// URL : PUT http://localhost:3000/api/rooms/:id
router.put('/:id', authRequired, requireRole('admin'), validateUpdateRoom, validateRequest, roomController.updateRoom);

module.exports = router;