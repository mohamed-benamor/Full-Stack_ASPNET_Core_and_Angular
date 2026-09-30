type PhotoBase = {
  id: number;
  url: string;
};

export type PhotoResponse = PhotoBase & {
  "public-id"?: string;
};

export type Photo = PhotoBase & {
  publicId?: string;
};
