'use strict';
//import { Property } from './property';
//import { File, FILETYPE } from './file';

class PropertyFile {
  constructor(name, fileType) {
    this.type = 'file';

    this.name = name || '';
    this.FileType = fileType;
    this.Value = null;
  }
}

module.exports = PropertyFile;