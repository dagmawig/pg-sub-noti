// publishes message to a given channel
// this essently inserts a new row into the given table
// table needs to at least contain the columns 'channel' and 'data'
// 'channel' column is of postgres text type
// 'data' column is of postgres json type
function publish(client, schema, table, channel, data) {

    const text = `INSERT into ${schema}.${table}(channel, data) values ($1, $2) RETURNING *`;
    const values = [channel, data];

    client.query(text, values, (err, res) => {
        if (err) throw Error(`insertion error: ${err}`);
        console.log(`postgres message dispatch success: ${JSON.stringify(res, null, 2)}`);
    });
}

module.exports = publish;