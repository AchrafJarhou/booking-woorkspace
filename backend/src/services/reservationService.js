// Services pour les réservations
// Centralisent la logique de validation, calcul de prix, et anti-chevauchement
const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const AppError = require('../utils/AppError');

// Calcule le prix total selon le type de réservation
const calculatePrice = (room, typeReservation) => {
    switch (typeReservation) {
        case 'heure':
            return room.prix_heure || 0;
        case 'demi-journee':
            return room.prix_demi_journee || 0;
        case 'journee':
            return room.prix_journee || 0;
        default:
            return 0;
    }
};

// Récupère les réservations de l'utilisateur courant
const getUserReservations = async (userId) => {
    return Reservation.getByUserId(userId);
};

// Récupère toutes les réservations (admin)
const getAllReservations = async () => {
    return Reservation.getAll();
};

// Récupère une réservation spécifique
const getReservationById = async (id) => {
    const reservation = await Reservation.getById(id);
    if (!reservation) {
        throw new AppError('Réservation introuvable', 404);
    }
    return reservation;
};

// Crée une nouvelle réservation
const createReservation = async (data, userId) => {
    const { salle_id, date, heure_debut, heure_fin, type_reservation } = data;

    // Vérifier que la salle existe
    const room = await Room.getById(salle_id);
    if (!room) {
        throw new AppError('Salle introuvable', 404);
    }

    // Vérifier qu'il n'y a pas de chevauchement
    const hasConflict = await Reservation.hasConflict(salle_id, date, heure_debut, heure_fin);
    if (hasConflict) {
        throw new AppError('Cette salle est déjà réservée à cet horaire', 409);
    }

    // Calculer le prix total
    const prix_total = calculatePrice(room, type_reservation);

    // Créer la réservation
    const reservationId = await Reservation.create({
        date,
        heure_debut,
        heure_fin,
        type_reservation,
        statut: 'en-attente',
        prix_total,
        salle_id,
        utilisateur_id: userId
    });

    return {
        id: reservationId,
        date,
        heure_debut,
        heure_fin,
        type_reservation,
        statut: 'en-attente',
        prix_total,
        salle_id,
        utilisateur_id: userId
    };
};

// Annule une réservation
const cancelReservation = async (reservationId, userId, isAdmin = false) => {
    const reservation = await Reservation.getById(reservationId);
    if (!reservation) {
        throw new AppError('Réservation introuvable', 404);
    }

    // Vérifier que l'utilisateur est propriétaire ou admin
    if (!isAdmin && reservation.utilisateur_id !== userId) {
        throw new AppError('Accès refusé', 403);
    }

    // Vérifier que la réservation n'est pas déjà annulée
    if (reservation.statut === 'annulee') {
        throw new AppError('Cette réservation est déjà annulée', 400);
    }

    const cancelled = await Reservation.cancel(reservationId);
    if (!cancelled) {
        throw new AppError('Erreur lors de l\'annulation', 500);
    }
};

module.exports = {
    getUserReservations,
    getAllReservations,
    getReservationById,
    createReservation,
    cancelReservation,
    calculatePrice
};
