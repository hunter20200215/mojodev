

require('dotenv').config();


const mysql = require('mysql2');
 
// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


/*const mysql = require('serverless-mysql')({
    config: {
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DATABASE,
     
        debug:false
    }
  })*/
module.exports = pool;