'use strict';

function config() {
  this.DB_HOST = process.env.PGHOST;
  this.DB_PORT = process.env.PGPORT;
  this.DB_USER = process.env.PGUSER;
  this.DB_PASSWORD = process.env.PGPASSWORD;
  this.DB_NAME = process.env.PGDATABASE;
  this.BASE_FILE_DIR = process.env.BASE_FILE_DIR;

  this.DB_MAX_POOL = 20;
  this.DB_IDLE_TIMEOUT = 30000;
}

module.exports = new config();