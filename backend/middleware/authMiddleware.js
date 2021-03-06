import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

export const protect = asyncHandler(async(req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //Esto no tiene mucho sentido, alcanzaría con guardar solo el id del usuario
            //Ya que más adelante se usa el id para traer información de la base.
            /*TODO: revisar esto*/ 
            /*TODO: revisar caso en que el token está OK pero el usuario ya no exista en la base */
            req.user = await User.findById(decoded.id).select('-password');

            next();
        }
        catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed.')
        }
    };

    if(!token) {
        res.status(401);
        throw new Error('Not authorized, no token.');
    }
})

export const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(401);
        throw new Error('Not authorized as an admin.');
    }
}