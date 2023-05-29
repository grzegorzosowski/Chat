import { getUserFromSession } from '../controllers/userFunctions';
import { Request, Response } from 'express';

export const apiUnauthorizedAccessMiddleware = (req: Request, res: Response, next: any) => {
    const excludedRoutes = ['/login/password', '/createAccount', '/user'];
    const user = getUserFromSession(req.session);
    if (excludedRoutes.includes(req.path)) {
        next(); // Skip the middleware for excluded routes
    } else {
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            next();
        }
    }
};
