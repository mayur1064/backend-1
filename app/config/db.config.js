//var mysql = require('mysql');
module.exports = { 
    HOST: "localhost",
    USER: "project_monitoring",
    PASSWORD: "viit@123",
    DB: "project_monitoring",
    dialect: "mysql",
    pool:{
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
     
  }; 
/* 
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'roots',
  password: 'roots',
  database: 'newdatabase'
});

module.exports=connection;  */