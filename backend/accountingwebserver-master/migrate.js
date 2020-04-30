const pool = require('./connection/connect');

const results =  pool.query('select * from users', function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available

// If you execute same statement again, it will be picked from a LRU cache
// which will save query preparation time and give better performance
});