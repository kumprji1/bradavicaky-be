// Models
const HttpError = require('../models/HttpError')

// Utils
const { Role } = require('../utils/roles')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    if (req.user.role === Role.ADMIN) return next();
    else return next(new HttpError('Uživatel není admin', 401));
}