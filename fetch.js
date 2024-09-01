// fetches past message
// table needs to at least contain the columns 'channel' and 'data'
// 'channel' column is of postgres text type
// 'data' column is of postgres json type
async function fetch(fetchArgs) {
    const {client, schema, table, channel, from, to = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0]} = fetchArgs;
    
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