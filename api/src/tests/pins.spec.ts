import server from '../server';
import supertest from 'supertest';
import { expect } from 'chai';
import { doesNotMatch } from 'assert';

describe('route pins/', () => {
  it('should GET all pins', async done => {
    await supertest(server)
      .get('/pins')
      .expect(200)
      .then(res => {
        expect(res.body.length).to.be.greaterThan(1);
        done();
      });
  });

  it('should GET one pin', async done => {
    await supertest(server)
      .get('/pins/5fe6d05a07e2e1401b003106')
      .expect(200)
      .then(res => {
        expect(res.body._id).to.exist;
        done();
      });
  });

  it('should POST a pin with all fields', async done => {
    const data = {
      label: 'automation_test',
      userId: 999999,
      showOnMap: true,
      imageUrl: 'www.imgurl.com/5aiUkl',
      lat: 5.2,
      lng: -9.01
    };

    await supertest(server)
      .post('/pins')
      .send(data)
      .expect(200);
    done();
  });

  it('should not POST a pin with no fields', async done => {
    const data = {};

    await supertest(server)
      .post('/pins')
      .send(data)
      .expect(422);
    done();
  });

  it('should PATCH a pin', async done => {
    const data = {
      label: 'automation_test',
      userId: 999999,
      showOnMap: false,
      imageUrl: 'www.imgurl.com/5aiUkl',
      lat: 5.2,
      lng: -9.01
    };

    const id = '5fe6d05a07e2e1401b003106';

    await supertest(server)
      .patch(`/pins/${id}`)
      .send(data)
      .expect(200)
      .then(res => {
        expect(res.body).to.exist;
        done();
      });
  });

  it('should not PATCH a pin with no fields', async done => {
    const data = {};

    const id = '5fe6d05a07e2e1401b003106';

    await supertest(server)
      .patch(`/pins/${id}`)
      .send(data)
      .expect(200)
      .then(res => {
        expect(res.body).to.exist;
        done();
      });
  });

  it('should DELETE a pin', async done => {
    const data = {
      label: 'automation_test',
      userId: 999999,
      lat: 5.2,
      lng: -9.01
    };

    await supertest(server)
      .post('/pins')
      .send(data)
      .then(async res => {
        await supertest(server)
          .delete(`/pins/${res.body._id}`)
          .expect(200);
        done();
      });
  });
});
