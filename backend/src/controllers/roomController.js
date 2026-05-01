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
// Détail d'une salle avec sa galerie
// const getRoomDetails = async (req, res) => {
//     try {
//         const { id } = req.params;
        
//         // On lance les deux requêtes
//         const room = await Room.getById(id);
        
//         if (!room) {
//             return res.status(404).json({ message: "Salle non trouvée" });
//         }

//         const photos = await Room.getPhotos(id);

//         // On fusionne les données : on ajoute la galerie dans l'objet room
//         res.status(200).json({
//             ...room,
//             galerie: photos
//         });

//     } catch (error) {
//         res.status(500).json({ message: "Erreur serveur" });
//     }
// };

// Création d'une salle (Admin)
// POST /api/rooms
// Crée une salle avec sa galerie (si fournie). Les validations doivent se faire en amont.
const createRoom = asyncHandler(async (req, res) => {
    const createdRoom = await roomService.createRoom(req.body);
    res.status(201).json(createdRoom);
});

module.exports = {
    getAllRooms,
    getRoomDetails,
    createRoom
};