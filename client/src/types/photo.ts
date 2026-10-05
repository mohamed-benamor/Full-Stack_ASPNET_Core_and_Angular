type PhotoBase = {
  id: number;
  url: string;
};

export type Photo = PhotoBase & {
  publicId?: string;
};
