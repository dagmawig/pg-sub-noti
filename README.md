# Installation

npm i pg-sub-noti

# Database Setup

For the packages subscribe, publish and fetch functions to work you need to have the following set up in your postgres database.

## Step 1

Create a schema and a table under it. The table NEEDS to have the following columns with the mentioned data types.

    - channel (with text data type)
    - data (with json data type)
    - created_at (with timestamptz data type)
    - updated_at (with timestamptz data type)

Here is an example..

```
CREATE SCHEMA queue; -- creates a schema called queue  
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- helps us generate uuids  
CREATE TABLE queue.message (  
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),  
    channel text,  
    data json,  
    created_at timestamptz,  
    updated_at timestamptz  
); -- creates a table with columns id, channel, data, created_at & updated_at  
ALTER TABLE queue.message ALTER COLUMN created_at SET DEFAULT now();  
ALTER TABLE queue.message ALTER COLUMN updated_at SET DEFAULT now();  
-- above two lines make created_at and updated_at columns to be autopopulated  
```

## Step 2

Create a notify function under the schema. You can use the following example.

```
CREATE OR REPLACE FUNCTION queue.new_message_notify() RETURNS TRIGGER AS $$  
            DECLARE  
            BEGIN  
                PERFORM pg_notify(cast(NEW.channel as text), row_to_json(new)::text);  
                RETURN NEW;  
            END;  
            $$ LANGUAGE plpgsql;  
```

## Step 3

Create a tigger on the table you created. The trigger calls the function every time a new row is inserted in the table.

Here is an example..

```
CREATE TRIGGER new_insert_trigger BEFORE INSERT ON queue.message  
            FOR EACH ROW EXECUTE PROCEDURE queue.new_message_notify();  
```

Great! Now your database is ready to handle the publish/subscribe/fetch requests from a client.

# Implementation

In order to use the the library, we must first connect to the postgres database using the pg client package like so.

```
const { Client } = require('pg');  
require('dotenv').config();  

// this is the postgres database connection string  
const connectionString = process.env.DATABASE_URL;  

if (!connectionString) console.error(`env var DATABASE_URL not set!!`);  

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

module.exports = pgClient;  
```

Now we can use the postgres client we created to..

Subscribe/Publish/Fetch like so.

```
const {subscribe, publish, fetch} = require('pg-sub-noti');  

// to subscribe to a channel  
Promise.resolve(  
            subscribe({client:pgClient, channel: 'news'})).then(message=>{  
                    // this is the message received  
                    console.log(message);  
                });  

// to publish a message  
publish({  
    client: pgClient,  
    schema: 'queue',  
    table: 'message',  
    channel: 'news',  
    data: {sport: 'NFL'}  
});  

// to fetch message  
// if no end date is given it fetches mssages up to present time  
Promise.resolve(  
        fetch{  
            client: pgClient,  
            schema: 'queue',  
            table: 'message',  
            channel: 'news',  
            from: '2024-08-10'  
            to: '2024-08-18' // optional  
        }  
).then(messages=>{  
    // returns array of messages sent between the date ranges  
    console.log(messages);  
});  
```

That is it! Now you can send and recevie messages using postgres database.

Note: this message system doesnt have a way to confirm message is actually receved by subscribers. You can use the fetch function to mitigate this problem whenever a client is down and misses message sent.

Any feedback is appreciated...




