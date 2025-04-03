type Size = {
  filename: string | null;
  filesize: string | null;
  height: string | null;
  mimeType: string | null;
  url: string | null;
  width: string | null;
};

export interface IMedia {
  id: string;
  alt?: string;
  createdAt: string;
  updatedAt: string;
  filename: string;
  filesize: number;
  focalX: number;
  focalY: number;
  height: number;
  width: number;
  mimeType: string;
  sizes: {
    large: Size;
    medium: Size;
    og: Size;
    small: Size;
    square: Size;
    thumbnail: Size;
    xlarge: Size;
  };
  thumbnailURL: string;
  url: string;
}
