'use strict';

const db = require('../db');
const fs = require('fs');
const async = require('async');

const config = require('../config');

function FileUtility() {}

FileUtility.prototype.getFiles = function(type, cb) {
  db.getFiles(type, function (err, fileRecords) {
    if (err) {
      return cb(err);
    }

    let files = [];

    if (fileRecords && fileRecords.rowCount) {
      async.each(fileRecords.rows, 
        function(fileRecord, next) {
          let filename = fileRecord['u_filename'];

          let options = {
            encoding: 'hex',
            flag: 'w+'
          }

          fs.writeFile(config.BASE_FILE_DIR + 'tmp/' + filename, fileRecord['x_data'], options, function (err) {
            if (err) {
              return next(err);
            }
  
            let file = {
              id: fileRecord['k_file'],
              name: filename
            }
  
            files.push(file);
            return next();
          });
        }, 
        function(err) {
          if (err) {
            return cb(err);
          }
  
          return cb(null, files);
        }
      );
    }
  });
}

module.exports = new FileUtility();