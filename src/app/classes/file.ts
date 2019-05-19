export interface File {
  id: number,
  type: FILETYPE,
  filename: string
}

export enum FILETYPE {
  Image
}