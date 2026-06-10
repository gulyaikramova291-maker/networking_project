const { Sequelize } = require('sequelize');
require('dotenv').config();

const isSqlite = process.env.DB_DIALECT === 'sqlite';

const sequelize = isSqlite
  ? new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || './database.sqlite',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    })
  : new Sequelize(
      process.env.DB_NAME || 'tekstilhub',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASS || 'password',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        dialectOptions:
          process.env.NODE_ENV === 'production'
            ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: false,
                },
              }
            : {},
      }
    );

module.exports = sequelize;
