type MemberBase = {
  id: string;
  email: string;
  gender: string;
  city: string;
  country: string;
  description?: string;
  created: Date;
};
export type Member = MemberBase & {
  displayName: string;
  dateOfBirth: Date;
  imageUrl?: string;
  lastActive: Date;
};

type MemberBodyBase = {
  description?: string;
  city: string;
  country: string;
};

export type EditableMember = MemberBodyBase & {
  displayName: string;
};
