const subscribe = require('../subscribe');
const publish = require('../publish');
const pgClient = require('./pgClient');
const fetch = require('../fetch');

// test to confrim successful clients' subscription to a postgres channel and past message fetching
describe('tests client subscription', () => {
    afterAll((done) => {
        pgClient.end();
        done();
    });

     // tests clients subscription to a channel
     it('subscribes a client', (done) => {

        subscribe({ client: pgClient, channel: 'news' }).then(response => {
            expect(response).toMatchObject({ channel: 'news', data: { name: 'DAG' } })
            done();
        })

        publish({ client: pgClient, schema: 'queue', table: 'message', channel: 'news', data: { name: 'DAG' } })

    });

    // tests message fetching functionality
    it.only('fetches past messages', (done) => {
        fetch({client: pgClient, schema: 'queue', table: 'message', channel: 'news', from: '2024-09-01', to: '2024-09-02', filter: {channel: 'DAG'}}).then(response => {
            expect(response[0]).toMatchObject({
                "id": "cf9bd3e6-beb2-4329-a33e-02680b43ab31",
                "channel": "news",
                "data": {
                    "name": "DAG"
                }
            })
            done();
        })

    }, 30000)
});