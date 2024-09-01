

async function fetch(client, schema, table, channel, from, to = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0]) {

    const sql = `SELECT * from ${schema}.${table} m WHERE m.channel = '${channel}' and m.created_at>='${from}' and m.created_at<'${to}'`;

    const fetchPromise = new Promise(resolve => {
        client.query(sql, (err, res)=> {
            if(err) throw Error(`message fetch error: ${err}`);
            resolve(res.rows);
        })
    })

    return fetchPromise;
};

module.exports = fetch;