/* eslint-env jest */

import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import db from '../services/sequelize';
import app from '../../index';

const basePath = '/documents';

/**
 * root level hooks
 */
beforeAll(() => {
  db.sequelize.sync();
});

afterAll(() => {
  db.sequelize.close();
});

describe('## User APIs', () => {
  describe(`# GET ${basePath}`, () => {
    test('should get all documents', (done) => {
      request(app)
        .get(`${basePath}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(Array.isArray(res.body));
          done();
        })
        .catch(done);
    });

    test('should get all documents (with limit and skip)', (done) => {
      request(app)
        .get(`${basePath}`)
        .query({ limit: 10, offset: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(Array.isArray(res.body));
          done();
        })
        .catch(done);
    });
  });
});
