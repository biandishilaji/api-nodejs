const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'local',
    port: 3306,
    user: 'root',
    password: '12345',
    database: 'app'
});

module.exports = connection