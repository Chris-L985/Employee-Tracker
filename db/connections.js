const mysql = require('mysql2');

// mysql connection information
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SnipeTTT_98",
    database: "employeetracker",
    multipleStatements: true,
},
console.log("Employee tracker connected.")
);

// db export
module.exports = db;