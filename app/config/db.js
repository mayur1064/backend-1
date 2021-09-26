var mysql = require('mysql');

var connection = mysql.createConnection({
  //socketPath: '34.93.103.215/sound-micron-290407:asia-south1:newdatabase',
  /* socketPath     : '/cloudsql/sound-micron-290407:asia-south1:newdatabase', */
  host: 'localhost',
  user: 'project_monitoring',
  password: 'viit@123',
  database: 'project_monitoring'
});
 
module.exports=connection;  