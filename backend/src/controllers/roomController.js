// Controller mince pour les salles.
// Délégué aux services : récupération, création, composition des données.
const roomService = require('../services/roomService');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/rooms
// Renvoie la liste des salles (jointures déjà réalisées dans le service)
const getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await roomService.getAllRooms();
    res.status(200).json(rooms);
});

// GET /api/rooms/available?date=YYYY-MM-DD&ville=...&capacite_min=...&type_id=...
// Retourne les salles disponibles à une date donnée avec filtres optionnels
const getAvailableRooms = asyncHandler(async (req, res) => {
    const { date, ville, capacite_min, type_id } = req.query;

    const filters = {
        ville: ville || undefined,
        capacite_min: capacite_min ? parseInt(capacite_min) : undefined,
        type_id: type_id ? parseInt(type_id) : undefined
    };

    const rooms = await roomService.getAvailableRooms(date, filters);
    res.status(200).json(rooms);
});

// GET /api/rooms/:id
// Récupère salle + galerie + équipements et renvoie un objet unifié
const getRoomDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const fullRoomData = await roomService.getRoomDetails(id);
    res.status(200).json(fullRoomData);
});

// POST /api/rooms
// Crée une salle avec sa galerie et équipements. Les validations sont effectuées
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

// DELETE /api/rooms/:id
// Supprime une salle
const deleteRoom = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await roomService.deleteRoom(id);
    res.status(200).json({ message: 'Salle supprimee avec succes' });
});

module.exports = {
    getAllRooms,
    getAvailableRooms,
    getRoomDetails,
    createRoom,
    updateRoom,
    deleteRoom
};