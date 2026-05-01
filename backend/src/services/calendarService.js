// Services pour les endpoints d'agenda
// Formate les réservations au format FullCalendar pour affichage dans le frontend

const Reservation = require('../models/Reservation');
const AppError = require('../utils/AppError');

// Mappe les statuts de réservation à des couleurs pour FullCalendar
const statusColorMap = {
    'en-attente': '#FFA500',    // Orange
    'confirmee': '#4CAF50',     // Vert
    'annulee': '#9E9E9E',       // Gris
    'completee': '#2196F3'      // Bleu
};

// Formate une réservation au format FullCalendar
const formatReservationToEvent = (reservation) => {
    // Construction du titre: "Salle - User - Type"
    const title = `${reservation.salle_nom} - ${reservation.utilisateur_nom} (${reservation.type_reservation})`;

    // Construction de la date/heure au format ISO (FullCalendar accepte ISO 8601)
    const startDateTime = new Date(`${reservation.date}T${reservation.heure_debut}`);
    const endDateTime = new Date(`${reservation.date}T${reservation.heure_fin}`);

    // Déterminer la couleur selon le statut
    const backgroundColor = statusColorMap[reservation.statut] || '#2196F3';

    return {
        id: `reservation-${reservation.id}`,
        title: title,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        resourceId: `salle-${reservation.salle_id}`,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        textColor: '#fff',
        extendedProps: {
            reservationId: reservation.id,
            salleId: reservation.salle_id,
            utilisateurId: reservation.utilisateur_id,
            statut: reservation.statut,
            prixTotal: reservation.prix_total,
            typeReservation: reservation.type_reservation,
            salleNom: reservation.salle_nom,
            utilisateurNom: reservation.utilisateur_nom,
            utilisateurEmail: reservation.utilisateur_email
        }
    };
};

// Récupère toutes les réservations pour une période donnée et les formate
const getCalendarEvents = async (startDate, endDate, salleId = null) => {
    // Récupérer toutes les réservations
    const reservations = await Reservation.getAll();

    // Filtrer par période de dates
    const filteredReservations = reservations.filter(res => {
        const resDate = new Date(res.date);
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Inclure si la date de réservation est entre startDate et endDate
        return resDate >= start && resDate <= end;
    });

    // Filtrer par salle si spécifié
    const finalReservations = salleId
        ? filteredReservations.filter(res => res.salle_id === parseInt(salleId))
        : filteredReservations;

    // Formater les réservations en événements FullCalendar
    const events = finalReservations.map(formatReservationToEvent);

    return events;
};

// Récupère les réservations disponibles par salle et date (pour affichage des créneaux libres)
const getAvailableSlots = async (date, salleId) => {
    // Récupérer toutes les réservations du jour pour cette salle
    const reservations = await Reservation.getAll();
    const dayReservations = reservations.filter(res => res.date === date && res.salle_id === parseInt(salleId));

    // Horaires standards (8h à 18h)
    const dayStart = 8;
    const dayEnd = 18;
    const slotDuration = 1; // en heures

    // Créer tous les créneaux possibles
    const allSlots = [];
    for (let hour = dayStart; hour < dayEnd; hour++) {
        allSlots.push({
            start: `${String(hour).padStart(2, '0')}:00`,
            end: `${String(hour + slotDuration).padStart(2, '0')}:00`
        });
    }

    // Marquer les créneaux comme occupés ou libres
    const slotsWithAvailability = allSlots.map(slot => {
        const isOccupied = dayReservations.some(res => {
            // Vérifier si le créneau chevauche une réservation
            return !(slot.end <= res.heure_debut || slot.start >= res.heure_fin);
        });

        return {
            ...slot,
            available: !isOccupied
        };
    });

    return slotsWithAvailability;
};

// Récupère les statistiques d'utilisation des salles sur une période
const getCalendarStats = async (startDate, endDate) => {
    const reservations = await Reservation.getAll();

    // Filtrer par période
    const filteredReservations = reservations.filter(res => {
        const resDate = new Date(res.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return resDate >= start && resDate <= end;
    });

    // Calculer les stats
    const stats = {
        totalReservations: filteredReservations.length,
        byStatus: {
            'en-attente': filteredReservations.filter(r => r.statut === 'en-attente').length,
            'confirmee': filteredReservations.filter(r => r.statut === 'confirmee').length,
            'annulee': filteredReservations.filter(r => r.statut === 'annulee').length,
            'completee': filteredReservations.filter(r => r.statut === 'completee').length
        },
        byRoom: {},
        totalRevenue: 0
    };

    // Compter par salle et calculer revenu
    filteredReservations.forEach(res => {
        if (!stats.byRoom[res.salle_nom]) {
            stats.byRoom[res.salle_nom] = 0;
        }
        stats.byRoom[res.salle_nom]++;

        // Ajouter au revenu si confirmée (pas annulée)
        if (res.statut !== 'annulee') {
            stats.totalRevenue += res.prix_total || 0;
        }
    });

    return stats;
};

module.exports = {
    getCalendarEvents,
    getAvailableSlots,
    getCalendarStats,
    formatReservationToEvent
};
