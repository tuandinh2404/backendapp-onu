
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '@/config';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '@/interfaces/IUser';
import User from '@/models/User';
import Session from '@/models/Session';

export default class AuthServices {
    public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: String; refreshToken: String }> {
        try{
            const existing = await User.findOne({ where: { username: userInputDTO.username } });
            if(existing) throw new Error('Username đã tồn tại');
            const checkUid = await User.findOne({ where: { uid: userInputDTO.uid } });
            if(checkUid) throw new Error('UID đã tồn tại');
            const salt = randomBytes(32).toString('hex');
            const hash_password = await bcrypt.hash(userInputDTO.password, 10);
            const userRecord = await User.create({
                username: userInputDTO.username,
                password_hash: hash_password,
                full_name: userInputDTO.full_name,
                uid: userInputDTO.uid,
            });
            const token = this.generateAccessToken(userRecord as unknown as IUser);
            const refreshToken = await this.generateRefreshToken(userRecord.getDataValue('id'));

            const user = userRecord.toJSON() as IUser;
            Reflect.deleteProperty(user, 'password_hash');

            return { user, token, refreshToken };

        } catch (err) {
            throw err;
        }
    }
    public async SignIn(username: string, password: string, deviceInfo?: string): Promise<{ user: IUser; token: String; refreshToken: String }> {
        const userRecord = await User.findOne({ where: { username } });
        if(!userRecord) throw new Error('Không tìm thấy người dùng');
        const isPasswordValid = await bcrypt.compare(password, userRecord.getDataValue('password_hash'));
        if(!isPasswordValid) throw new Error('Mật khẩu không chính xác');

        const token = this.generateAccessToken(userRecord as unknown as IUser);
        const refreshToken = await this.generateRefreshToken(userRecord.getDataValue('id'), deviceInfo);

        const user = userRecord.toJSON() as IUser;
        Reflect.deleteProperty(user, 'password_hash');
        
        return { user, token, refreshToken };
    }
    public async SignOut(refreshToken: string): Promise<void> {
        await Session.destroy({ where: { refresh_token: refreshToken } });
    }

    private generateAccessToken(user: IUser): string {
        const exp = new Date();
        exp.setDate(exp.getDate() + 7);

        return jwt.sign(
            {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                uid: user.uid,
                role: user.role,
                exp: Math.floor(exp.getTime() / 1000),
            },
            config.jwtSecret as string
        );
    }

    private async generateRefreshToken(userId: number, deviceInfo?: string): Promise<string> {
        const refreshToken = randomBytes(64).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 60);

        await Session.create({
            user_id: userId,
            refresh_token: refreshToken,
            expires_at: expiresAt,
            device_info: deviceInfo,
        })
        return refreshToken;
    }


}