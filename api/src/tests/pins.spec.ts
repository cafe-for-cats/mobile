import server from '../server';
import supertest from 'supertest';
import { expect } from 'chai';

describe('route pins/', () => {
  it('should GET all pins', async () => {
    await supertest(server)
      .get('/pins')
      .expect(200)
      .then(res => {
        expect(res.body.length).to.be.greaterThan(1);
      });
  });

  it('should GET one pin', async () => {
    await supertest(server)
      .get('/pins/5fe5937154e12d1c44e725f6')
      .expect(200)
      .then(res => {
        expect(res.body._id).to.exist;
        expect(res.body.label).to.exist;
        expect(res.body.userId).to.exist;
      });
  });

  it('should fail on POST a pin with no fields', async () => {
    const data = {};

    await supertest(server)
      .post('/pins')
      .send(data)
      .expect(422);
  });

  it('should POST a pin with all fields', async () => {
    const data = {
      label: 'automation_test',
      userId: 999999,
      showOnMap: true,
      imageUrl: 'www.imgurl.com/5aiUkl'
    };

    await supertest(server)
      .post('/pins')
      .send(data)
      .then(res => {
        expect(res.body.label).to.equal('automation_test');
        expect(res.body.userId).to.equal(999999);
        expect(res.body.showOnMap).to.be.true;
        expect(res.body.imageUrl).to.equal('www.imgurl.com/5aiUkl');
      });
  });
});
