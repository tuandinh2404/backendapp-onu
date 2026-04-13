export interface IUser {
  id: string;
  username: string;
  password_hash: string;
  full_name: string;
  uid: string;
}

export interface IUserInputDTO {
  username: string;
  password: string;
  full_name: string;
  uid: string;
}