export type RegisterRequest = {
  "display-name": string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};
