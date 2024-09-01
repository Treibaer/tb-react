import { Sequelize } from "sequelize";
// import { ProductEntity } from "../models/product.js";

export const sequelize: Sequelize = new Sequelize("ptl_dev", "root", "", {
  dialect: "mariadb",
  logging: false,
});
