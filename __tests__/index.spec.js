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

        Promise.resolve(subscribe(pgClient, 'news')).then(response => {
            expect(response).toMatchObject({ channel: 'news', data: { name: 'DAG' } })
            done();
        })
        publish(pgClient, 'queue', 'message', 'news', { name: 'DAG' })

    });

    // tests message fetching functionality
    it('fetches past messages', (done) => {
        Promise.resolve(fetch(pgClient, 'queue', 'message', 'tree', '2024-08-10', '2024-08-23')).then(response => {
            expect(response[0]).toMatchObject({
                "id": "9a02e4bd-ab0f-42df-b6ea-f2ffaedafa4d",
                "channel": "tree",
                "data": {
                    "capture_id": "baf29ea3-5a9f-4c1a-b338-d6676e37ada8"
                },
                "created_at": new Date("2024-08-16T20:15:07.900Z"),
                "updated_at": new Date("2024-08-16T20:15:07.900Z")
            })
            done();
        })

    }, 30000)
});




