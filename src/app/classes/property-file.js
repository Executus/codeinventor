class PropertyFile {
  constructor(name, fileType) {
    this.type = 'file';

    this.name = name || '';
    this.FileType = fileType;
    this.Value = null;
  }
}