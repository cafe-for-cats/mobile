import { expect } from 'chai';
import supertest from 'supertest';
import server from '../server';

describe('main', () => {
  it('should always pass', () => {
    expect(true).to.equal(true);
  });

  it('should has status code 200', done => {
    supertest(server)
      .get('/')
      .expect(200)
      .end((err: any, res: any) => {
        if (err) done(err);
        done();
      });
  });
});
