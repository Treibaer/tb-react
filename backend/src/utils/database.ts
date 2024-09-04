import { Sequelize } from "sequelize";

export const sequelize: Sequelize = new Sequelize("ptl_dev", "root", "", {
  dialect: "mariadb",
  logging: false,
});
