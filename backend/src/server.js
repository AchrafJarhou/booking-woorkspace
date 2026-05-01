require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 1. Importation des routes (on les créera juste après)
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');
const typeRoutes = require('./routes/typeRoutes');
const equipementRoutes = require('./routes/equipementRoutes');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json()); 

// --- ROUTES ---

// Route de test
app.get('/', (req, res) => {
    res.send('Serveur Workly opérationnel !');
});

// 2. Utilisation des routes spécialisées
// Routes d'authentification (publiques)
app.use('/api/auth', authRoutes);

// Routes protégées par authentification et rôles
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/types', typeRoutes);
app.use('/api/equipements', equipementRoutes);
app.use('/api/reservations', reservationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// Note: le middleware 'notFoundHandler' doit être monté APRES toutes les routes
// afin de capturer les chemins non définis. Le middleware 'errorHandler' est
// le dernier pour uniformiser les réponses d'erreur.


// --- LANCEMENT ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur : http://localhost:${PORT}`);
});