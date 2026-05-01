// Helper pour éviter try/catch répétitifs dans les controllers.
// Il capture les erreurs async et les passe au middleware d'erreur via next(err).
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = asyncHandler;
