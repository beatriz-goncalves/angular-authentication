export interface UserAuthentication {
  id: number;
  name: string;
  email: string;
  password: string;
  isLogged: boolean;
}

export enum Encryption {
  encrypt,
  decrypt,
}
