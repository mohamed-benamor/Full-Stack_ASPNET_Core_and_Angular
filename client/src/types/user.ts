type UserBase = {
  id: string;
  email: string;
  token: string;
};

export type UserResponse = UserBase & {
  "display-name": string;
  "image-url"?: string;
};

export type User = UserBase & {
  displayName: string;
  imageUrl?: string;
};
