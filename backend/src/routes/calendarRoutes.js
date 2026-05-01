const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { authRequired, requireRole } = require('../middlewares/auth');

// GET /api/calendar/events?start=YYYY-MM-DD&end=YYYY-MM-DD&salle_id=optional
// Retourne les événements (réservations) formatées pour FullCalendar
// Public: tout le monde peut voir les réservations
router.get('/events', calendarController.getCalendarEvents);

// GET /api/calendar/available?date=YYYY-MM-DD&salle_id=ID
// Retourne les créneaux disponibles pour une salle et une date
// Public: utile pour afficher les créneaux libres lors de la réservation
router.get('/available', calendarController.getAvailableSlots);

// GET /api/calendar/stats?start=YYYY-MM-DD&end=YYYY-MM-DD
// Retourne les statistiques d'utilisation (admin only)
// Admin: statistiques de revenu, utilisation par salle, statuts des réservations
router.get('/stats', authRequired, requireRole('admin'), calendarController.getCalendarStats);

module.exports = router;
