const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');

// Récupérer tous les utilisateurs
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
});

// Récupérer les détails d'un utilisateur
const getUserDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
});

// créée un nouvel utilisateur
const createUser = asyncHandler(async (req, res) => {
    const userId = await userService.createUser(req.body);
    res.status(201).json({ id: userId, message: "utilisateur cree avec succes" });
});

// modification d'un utilisateur
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await userService.updateUser(id, req.body);
    res.status(200).json({ message: "utilisateur mis a jour avec succes" });
});

// suppression d'un utilisateur
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
 
   

 