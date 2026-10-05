type AuthBase = {
  email: string;
  password: string;
};

export type Credentials = AuthBase & {
  displayName: string;
  confirmPassword: string;
};

export type Profile = AuthBase & {
  dateOfBirth: string;
  gender: string;
  city: string;
  country: string;
};

export type RegisterRequest = Omit<Credentials & Profile, "confirmPassword">;

export type LoginRequest = AuthBase;
