import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user/User.entity.js";
import { Role } from "./entities/role/Role.entity.js";

import dotenv from "dotenv";
dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "postgres",
  synchronize: false, // use migrations instead!
  logging: true,
  entities: [
    // "./dist/db//entities/**/*.entity.js"
    User,
    Role
  ],

  migrations: ["./dist/db/migrations/**/*.js"],
});

export default AppDataSource
