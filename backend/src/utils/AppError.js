// AppError: exception métier utilisée pour signaler des erreurs prévues
// (ex: ressource introuvable, validation, accès refusé). Ces erreurs
// sont considérées comme "opérationnelles" et traitées proprement par le
// middleware global d'erreurs.
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
