// Controller pour les réservations
// Thin controller: délègue à reservationService
const reservationService = require('../services/reservationService');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/reservations/me
// Retourne les réservations de l'utilisateur courant
const getMyReservations = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const reservations = await reservationService.getUserReservations(userId);
    res.status(200).json(reservations);
});

// GET /api/reservations (admin only)
// Retourne toutes les réservations
const getAllReservations = asyncHandler(async (req, res) => {
    const reservations = await reservationService.getAllReservations();
    res.status(200).json(reservations);
});

// GET /api/reservations/:id
// Retourne une réservation spécifique
const getReservationDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const reservation = await reservationService.getReservationById(id);
    res.status(200).json(reservation);
});

// POST /api/reservations
// Crée une nouvelle réservation
const createReservation = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const result = await reservationService.createReservation(req.body, userId);
    res.status(201).json(result);
});

// PATCH /api/reservations/:id/cancel
// Annule une réservation
const cancelReservation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'admin';

    await reservationService.cancelReservation(id, userId, isAdmin);
    res.status(200).json({ message: 'Réservation annulée avec succès' });
});

module.exports = {
    getMyReservations,
    getAllReservations,
    getReservationDetails,
    createReservation,
    cancelReservation
};
