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
    const { photos, equipements, ...roomData } = data;
    const safePhotos = Array.isArray(photos) ? photos : [];
    const safeEquipements = Array.isArray(equipements) ? equipements : [];

    const id = await Room.create(roomData, safePhotos);

    // Ajouter les équipements si fournis
    if (safeEquipements.length > 0) {
        await Room.linkEquipments(id, safeEquipements);
    }

    return {
        id,
        ...roomData,
        photos: safePhotos,
        equipements: safeEquipements
    };
};

// Met à jour une salle existante
const updateRoom = async (id, data) => {
    // Vérifier que la salle existe
    const existing = await Room.getById(id);
    if (!existing) {
        throw new AppError('Salle introuvable', 404);
    }

    const { photos, equipements, ...roomData } = data;

    // Mettre à jour les champs de base
    const updated = await Room.update(id, roomData);
    if (!updated && Object.keys(roomData).length > 0) {
        throw new AppError('Erreur lors de la mise à jour', 500);
    }

    // Gérer les équipements si fournis
    if (Array.isArray(equipements) && equipements.length > 0) {
        await Room.unlinkEquipments(id);
        await Room.linkEquipments(id, equipements);
    }

    // Gérer les photos si fournies
    if (Array.isArray(photos) && photos.length > 0) {
        // TODO: implémenter la suppression/ajout des photos
    }
};

// Récupère les salles disponibles à une date donnée avec filtres
const getAvailableRooms = async (date, filters = {}) => {
    if (!date) {
        throw new AppError('La date est obligatoire', 400);
    }

    const rooms = await Room.getAvailableByDate(date, filters);
    return rooms;
};

// Supprime une salle
const deleteRoom = async (id) => {
    const existing = await Room.getById(id);
    if (!existing) {
        throw new AppError('Salle introuvable', 404);
    }

    const deleted = await Room.delete(id);
    if (!deleted) {
        throw new AppError('Erreur lors de la suppression', 500);
    }
};

module.exports = {
    getAllRooms,
    getRoomDetails,
    createRoom,
    updateRoom,
    getAvailableRooms,
    deleteRoom
};
