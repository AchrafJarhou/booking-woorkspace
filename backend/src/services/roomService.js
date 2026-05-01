const Room = require('../models/Room');
const AppError = require('../utils/AppError');

const getAllRooms = async () => {
    return Room.getAll();
};

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

module.exports = {
    getAllRooms,
    getRoomDetails,
    createRoom
};
