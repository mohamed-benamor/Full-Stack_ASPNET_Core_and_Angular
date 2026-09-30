export type MemberResponse = {
  id: string;
  "display-name": string;
  email: string;
  gender: string;
  city: string;
  country: string;
  "date-of-birth": Date;
  description?: string;
  "image-url"?: string;
  created: Date;
  "last-active": Date;
};

export type Member = {
  id: string;
  displayName: string;
  email: string;
  gender: string;
  city: string;
  country: string;
  dateOfBirth: Date;
  description?: string;
  imageUrl?: string;
  created: Date;
  lastActive: Date;
};

export type EditableMember = {
  displayName: string;
  description?: string;
  city: string;
  country: string;
};
