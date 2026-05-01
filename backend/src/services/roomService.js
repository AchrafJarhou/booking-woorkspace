// Services pour les salles: centralisent la logique de lecture/écriture
// (jointures, transactions, composition d'objet pour les controllers)
const Room = require('../models/Room');
const AppError = require('../utils/AppError');

// Récupère toutes les salles (avec le nom du type)
const getAllRooms = async () => {
    return Room.getAll();
};

// Récupère une salle et assemble la galerie + équipements
const getRoomDetails = async (id) => {
    const room = await Room.getById(id);

    if (!room) {
        throw new AppError('Salle introuvable', 404);
    }

    const [photos, equipments] = await Promise.all([
        Room.getPhotos(id),
        Room.getEquipments(id)
    ]);

    return {
        ...room,
        galerie: photos.map((p) => p.url),
        equipements: equipments.map((e) => e.nom)
    };
};

// Crée une salle en transaction (le model gère la transaction)
// photos: tableau d'URLs (optionnel) qui sera inséré dans salle_photos
const createRoom = async (data) => {
    const { photos, ...roomData } = data;
    const safePhotos = Array.isArray(photos) ? photos : [];

    const id = await Room.create(roomData, safePhotos);

    return {
        id,
        ...roomData,
        photos: safePhotos
    };
};

// Met à jour une salle existante
const updateRoom = async (id, data) => {
    const updated = await Room.update(id, data);

    if (!updated) {
        throw new AppError('Salle introuvable', 404);
    }
};

module.exports = {
    getAllRooms,
    getRoomDetails,
    createRoom,
    updateRoom
};
