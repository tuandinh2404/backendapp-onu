import { Request, Response, Router } from 'express'
import UserService from '@/services/user/user'
import authMiddleware from '../middlewares/auth';

const router = Router();
const userService = new UserService();

router.get(
    '/profile', 
    authMiddleware, 
    async ( req: Request, res: Response) => {
    try {
        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await userService.getProfile(userId!);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }

});