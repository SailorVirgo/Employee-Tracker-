const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_tracker',
    password: 'd1tto',
    port: 5432,
});

// client.connect();
client.connect()
    .then(() => {
        console.log('Connected to the database');
        // mainMenu();
    })
    .catch(err => console.error('Database connection error', err.stack));

// export default client;
module.exports = client