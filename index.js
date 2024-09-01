const { Client } = require('pg');
const subscribe = require('./subscribe');
require('dotenv').config();


const connectionString = process.env.DATABASE_URL;

if(!connectionString) console.error(`env var DATABASE_URL not set!!`);

const pgClient = new Client({
    connectionString
});

pgClient.connect(err => {
    if (err) {
        const message = `error in connecting to DB: ${err}`;
        console.error(message);
        throw (message);
    }
    else {
        console.info(`Database connected!`);
    }
});

subscribe(pgClient, 'tree');
