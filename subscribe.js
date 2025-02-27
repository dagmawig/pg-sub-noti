// subscribes a client to a channel
async function subscribe(subArgs) {
    const {client, channel} = subArgs;
    const notiPromise = new Promise(resolve=> {
        client.on('notification', msg => {
            const newRow = JSON.parse(msg.payload);
            return resolve(newRow);
        });
    });

    client.query(`LISTEN ${channel}`, (err, res) =>{
        if(err) throw Error(`subscription error: ${err}`);
        console.info(`subscription success: ${JSON.stringify(res, null, 2)}`);
    });

    return notiPromise;
}

module.exports = subscribe;