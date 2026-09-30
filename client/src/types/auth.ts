type AuthBase = {
  email: string;
  password: string;
};

export type RegisterRequest = AuthBase & {
  "display-name": string;
};

export type LoginRequest = AuthBase;
