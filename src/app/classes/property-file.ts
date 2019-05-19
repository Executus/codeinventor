import { Property } from './property';
import { File, FILETYPE } from './file';

export class PropertyFile implements Property {
  name: string;
  type: string;

  public Value: File;
  public FileType: FILETYPE;

  constructor(name?: string, fileType?: FILETYPE) {
    this.type = 'file';

    this.name = name || '';
    this.FileType = fileType;
    this.Value = null;
  }
}
