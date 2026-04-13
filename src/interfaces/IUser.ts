export interface IUser {
  id: string;
  username: string;
  password_hash: string;
  full_name: string;
  uid: string;
  avatar_url?: string;
  email?: string;           // ? = chưa có cũng được
  role?: string;
  is_active?: boolean;
  last_login_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface IUserInputDTO {
  username: string;
  password: string;
  full_name: string;
  uid: string;
}