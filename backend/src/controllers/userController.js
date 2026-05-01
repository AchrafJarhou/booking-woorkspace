// Controller utilisateur: thin controllers, logique en service
const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');

// Récupérer tous les utilisateurs
// GET /api/users
// Attention: ne renvoie pas les mots de passe (service/model doit les exclure)
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
});

// Récupérer les détails d'un utilisateur
// GET /api/users/:id
const getUserDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
});

// créée un nouvel utilisateur
// POST /api/users
// Le hash du mot de passe et les vérifications doivent être faits en service
const createUser = asyncHandler(async (req, res) => {
    const userId = await userService.createUser(req.body);
    res.status(201).json({ id: userId, message: "utilisateur cree avec succes" });
});

// modification d'un utilisateur
// PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await userService.updateUser(id, req.body);
    res.status(200).json({ message: "utilisateur mis a jour avec succes" });
});

// suppression d'un utilisateur
// DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(200).json({ message: "utilisateur supprime avec succes" });
});


module.exports = {
    getAllUsers,
    getUserDetails,
    createUser,
    updateUser,
    deleteUser
};
 
   

 