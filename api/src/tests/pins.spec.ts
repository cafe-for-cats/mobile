import server from '../server';
import supertest from 'supertest';
import { expect } from 'chai';

describe('route pins/', () => {
  it('should GET all pins', async () => {
    return await supertest(server)
      .get('/pins')
      .expect(200)
      .then(res => {
        expect(res.body.length).to.be.greaterThan(1);
      });
  });

  it('should GET one pin', async () => {
    return await supertest(server)
      .get('/pins/5fefdbd93aac124e60b394d4')
      .expect(200)
      .then(res => {
        expect(res.body._id).to.exist;
      });
  });

  it('should POST a pin with all fields', async () => {
    const data = {
      label: 'automation_test',
      userId: 999999,
      showOnMap: true,
      imageUrl: 'www.imgurl.com/5aiUkl',
      lat: 5.2,
      lng: -9.01
    };

    return await supertest(server)
      .post('/pins')
      .send(data)
      .expect(200);
  });

  it('should not POST a pin with no fields', async () => {
    const data = {};

    return await supertest(server)
      .post('/pins')
      .send(data)
      .expect(422);
  });

  it('should PATCH a pin', async () => {
    const data = {
      label: 'automation_test',
      userId: 999999,
      showOnMap: false,
      imageUrl: 'www.imgurl.com/5aiUkl',
      lat: 5.2,
      lng: -9.01
    };

    const id = '5fe6d05a07e2e1401b003106';

    return await supertest(server)
      .patch(`/pins/${id}`)
      .send(data)
      .expect(200)
      .then(res => {
        expect(res.body).to.exist;
      });
  });

  it('should not PATCH a pin with no fields', async () => {
    const data = {};

    const id = '5fe6d05a07e2e1401b003106';

    return await supertest(server)
      .patch(`/pins/${id}`)
      .send(data)
      .expect(200)
      .then(res => {
        expect(res.body).to.exist;
      });
  });

  it('should DELETE a pin', async () => {
    const data = {
      label: 'automation_test',
      userId: 999999,
      lat: 5.2,
      lng: -9.01
    };

    return await supertest(server)
      .post('/pins')
      .send(data)
      .then(async res => {
        return await supertest(server)
          .delete(`/pins/${res.body._id}`)
          .expect(200);
      });
  });
});
