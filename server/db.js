//how to connect to the database
const Pool = require("pg").Pool;

//configuration for the database
const pool = new Pool({
    user: "postgres",
    password: "Catscars123",//this will be hidden
    host: "localhost",
    port: 5432,
    database: "ketehauora",

});

//export the database so it can used to send and receive info
module.exports = pool; 