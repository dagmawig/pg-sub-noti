const subscribe = require('../subscribe');
const publish = require('../publish');
const pgClient = require('./pgClient');

// test to confrim successful clients' subscription to a postgres channel
describe('tests client subscription', () => {
    afterAll((done) => {
        pgClient.end();
        done();
    });

    it('subscribes a client', (done) => {

        Promise.resolve(subscribe(pgClient, 'news')).then(response => {
            expect(response).toMatchObject({channel: 'news', data: { name: 'DAG' }})
            console.log(response);
            done();
        })
        publish(pgClient, 'queue', 'message', 'news', { name: 'DAG' })

    })
});




