import { Sequelize } from 'sequelize-typescript';
import { config } from './config/config';


const c = config;

console.log("config.host: " + c.host);
console.log("config.database: " + c.database);
console.log("config.username: " + c.username);

// Instantiate new Sequelize instance!
export const sequelize = new Sequelize({
  "username": c.username,
  "password": c.password,
  "database": c.database,
  "host":     c.host,

  dialect: 'postgres',
  storage: ':memory:',
});