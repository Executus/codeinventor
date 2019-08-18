class PropertyFile {
  constructor(name, fileType) {
    this.type = 'PropertyFile';

    this.name = name || '';
    this.FileType = fileType;
    this.Value = null;
    this.filename = '';
  }
}