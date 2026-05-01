// Controller pour les endpoints d'agenda
// Fournit les événements formatés pour FullCalendar et les données de disponibilité

const calendarService = require('../services/calendarService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// GET /api/calendar/events?start=YYYY-MM-DD&end=YYYY-MM-DD&salle_id=optional
// Retourne tous les événements (réservations) pour une plage de dates
const getCalendarEvents = asyncHandler(async (req, res) => {
    const { start, end, salle_id } = req.query;

    // Vérifier que les dates sont présentes
    if (!start || !end) {
        throw new AppError('Les paramètres start et end sont obligatoires (format: YYYY-MM-DD)', 400);
    }

    // Valider le format des dates
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new AppError('Format de date invalide (doit être YYYY-MM-DD)', 400);
    }

    // Vérifier que start <= end
    if (startDate > endDate) {
        throw new AppError('La date de début doit être avant la date de fin', 400);
    }

    // Récupérer les événements
    const events = await calendarService.getCalendarEvents(start, end, salle_id);

    res.status(200).json({
        success: true,
        count: events.length,
        data: events
    });
});

// GET /api/calendar/available?date=YYYY-MM-DD&salle_id=ID
// Retourne les créneaux disponibles pour une date et une salle donnée
const getAvailableSlots = asyncHandler(async (req, res) => {
    const { date, salle_id } = req.query;

    // Vérifier les paramètres obligatoires
    if (!date || !salle_id) {
        throw new AppError('Les paramètres date et salle_id sont obligatoires', 400);
    }

    // Valider la date
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        throw new AppError('Format de date invalide (doit être YYYY-MM-DD)', 400);
    }

    // Récupérer les créneaux disponibles
    const slots = await calendarService.getAvailableSlots(date, salle_id);

    res.status(200).json({
        success: true,
        date: date,
        salleId: salle_id,
        slots: slots
    });
});

// GET /api/calendar/stats?start=YYYY-MM-DD&end=YYYY-MM-DD
// Retourne les statistiques d'utilisation des salles (admin only)
const getCalendarStats = asyncHandler(async (req, res) => {
    const { start, end } = req.query;

    // Vérifier les paramètres obligatoires
    if (!start || !end) {
        throw new AppError('Les paramètres start et end sont obligatoires', 400);
    }

    // Valider les dates
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new AppError('Format de date invalide (doit être YYYY-MM-DD)', 400);
    }

    if (startDate > endDate) {
        throw new AppError('La date de début doit être avant la date de fin', 400);
    }

    // Récupérer les stats
    const stats = await calendarService.getCalendarStats(start, end);

    res.status(200).json({
        success: true,
        startDate: start,
        endDate: end,
        data: stats
    });
});

module.exports = {
    getCalendarEvents,
    getAvailableSlots,
    getCalendarStats
};
