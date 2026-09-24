export type UserResponse = {
  id: string;
  "display-name": string;
  email: string;
  token: string;
  "image-url"?: string;
};

export type User = {
  id: string;
  displayName: string;
  email: string;
  token: string;
  imageUrl?: string;
};
