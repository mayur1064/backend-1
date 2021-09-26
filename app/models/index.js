const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.person = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.person, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "Person_Id"
});
db.person.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "Person_Id",
  otherKey: "roleId"
});

db.ROLES = ["Leader","Member", "guide", "hod" , "director","management","coordinator"];

module.exports = db;