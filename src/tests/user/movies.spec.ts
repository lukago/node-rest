import {BaseTest} from '../BaseTest';
import * as mongoose from 'mongoose';

describe('Movies REST test', () => {

    const test = new BaseTest();
    const req = {
        title: 'crash'
    };

    before((done) => {
        mongoose.connect('mongodb://localhost:27017/moviedbtest', {useNewUrlParser: true});
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', () => {
            console.log('Connected to db.');
            done();
        });
    });

    it('it should add a new movie', (done) => {
        test.chai.request(test.server)
            .post(`${test.route}/movies`)
            .send(req)
            .end((err, res) => {
                res.status.should.equal(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                done();
            });
    });

    it('it should return error message', (done) => {
        test.chai.request(test.server)
            .post(`${test.route}/movies`)
            .send(req)
            .end((err, res) => {
                res.status.should.equal(400);
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(false);
                res.body.should.have.property('message');
                done();
            });
    });

    after((done) => {
        mongoose.connection.db.dropDatabase(() => {
            console.log('db drop');
            done();
        });
    });

});
