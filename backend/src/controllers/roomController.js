// Controller mince pour les salles.
// Délégué aux services : récupération, création, composition des données.
const roomService = require('../services/roomService');
const asyncHandler = require('../utils/asyncHandler');

// Récupérer toutes les salles
// GET /api/rooms
// Renvoie la liste des salles (jointures déjà réalisées dans le service)
const getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await roomService.getAllRooms();
    res.status(200).json(rooms);
});

// Récupérer les détails d'une salle (avec sa galerie) - VERSION OPTIMISÉE (2 requêtes lancées en parallèle)
// GET /api/rooms/:id
// Récupère salle + galerie + équipements et renvoie un objet unifié
const getRoomDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const fullRoomData = await roomService.getRoomDetails(id);
    res.status(200).json(fullRoomData);
});


// Création d'une salle (Admin)
// POST /api/rooms
// Crée une salle avec sa galerie (si fournie). Les validations sont effectuées
// via express-validator dans les routes.
const createRoom = asyncHandler(async (req, res) => {
    const createdRoom = await roomService.createRoom(req.body);
    res.status(201).json(createdRoom);
});

// PUT /api/rooms/:id
// Met à jour une salle existante
const updateRoom = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await roomService.updateRoom(id, req.body);
    res.status(200).json({ message: 'Salle mise a jour avec succes' });
});

module.exports = {
    getAllRooms,
    getRoomDetails,
    createRoom,
    updateRoom
};