/* eslint-env jest */

import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import db from '../services/sequelize';
import app from '../../index';

const basePath = '/things';

/**
 * root level hooks
 */
beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(() => {
  db.sequelize.close();
});

describe('## User APIs', () => {
  let thing = {
    id: '0x759C3D1931121240F9Ff108eccd2987d070c5Ec6',
  };
  describe(`# POST ${basePath}`, () => {
    test('should create a new thing', (done) => {
      request(app)
        .post(`${basePath}`)
        .send(thing)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.id).toEqual(thing.id);
          thing = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${basePath}/:id`, () => {
    test('should get thing details', (done) => {
      request(app)
        .get(`${basePath}/${thing.id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.id).toEqual(thing.id);
          done();
        })
        .catch(done);
    });

    test('should report error with message - Not found, when user does not exist', (done) => {
      request(app)
        .get(`${basePath}/12345`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).toEqual('Thing not found');
          done();
        })
        .catch(done);
    });
  });
});
