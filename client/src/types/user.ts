type UserBase = {
  id: string;
  email: string;
  token: string;
};

export type User = UserBase & {
  displayName: string;
  imageUrl?: string;
};
