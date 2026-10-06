export type Member = {
  id: string;
  email: string;
  gender: string;
  city: string;
  country: string;
  description?: string;
  created: Date;
  displayName: string;
  dateOfBirth: Date;
  imageUrl?: string;
  lastActive: Date;
};

export type EditableMember = {
  description?: string;
  city: string;
  country: string;
  displayName: string;
};

export class MemberParams {
  gender?: string;
  minAge = 18;
  maxAge = 99;
  pageNumber = 1;
  pageSize = 10;
}