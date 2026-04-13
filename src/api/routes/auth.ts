import { Request, Response, Router } from 'express';
import AuthService  from '@/services/auth'

const router = Router();
const authService = new AuthService();

router.post('/signup', async ( req: Request, res: Response) => {
    try {
        const { username, password, full_name, uid } = req.body;
        const { user, token, refreshToken} = await authService.SignUp({
            username,
            password,
            full_name,
            uid,
        });
        res.status(201).json({ user, token, refreshToken });
    } catch (err) {
        const error = err as Error;
        res.status(400).json({
            message: error.message || 'Đăng ký thất bại'
        })
    }
});

router.post('/login', async( req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const deviceInfo = req.headers['user-agent'] || 'unknown';
        const { user, token, refreshToken} = await authService.SignIn(username, password, deviceInfo);
        res.status(200).json({ message:'Đăng nhập thành công', user, token, refreshToken });
    } catch(err) {
        const error = err as Error;
        res.status(400).json({
            message: error.message || 'Đăng nhập thất bại'
        })
    }
})

router.post('/logout', async ( req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    await authService.SignOut(refreshToken);
    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({
      message: error.message || 'Đăng xuất thất bại'
    })
  }
})

export default router;