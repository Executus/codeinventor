import { Property } from './property';

export enum FILETYPE {
  Image
}

export class PropertyFile implements Property {
  name: string;
  type: string;

  public FileType: FILETYPE;

  constructor(name?: string, fileType?: FILETYPE) {
    this.type = 'file';

    this.name = name || '';
    this.FileType = fileType;
  }
}
