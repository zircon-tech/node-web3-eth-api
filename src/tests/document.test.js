/* eslint-env jest */

import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import db from '../services/sequelize';
import app from '../../index';

const basePath = '/documents';

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
  let document = {
    id: 'AB123',
    hash: 'HHSSHH',
  };
  describe(`# POST ${basePath}`, () => {
    test('should create a new document', (done) => {
      request(app)
        .post(`${basePath}`)
        .send(document)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.id).toEqual(document.id);
          expect(res.body.hash).toEqual(document.hash);
          document = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${basePath}/:documentId`, () => {
    test('should get document details', (done) => {
      request(app)
        .get(`${basePath}/${document.id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.id).toEqual(document.id);
          expect(Array.isArray(res.body.versions));
          done();
        })
        .catch(done);
    });

    test('should report error with message - Not found, when user does not exist', (done) => {
      request(app)
        .get(`${basePath}/12345`)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).toEqual('Document not found');
          done();
        })
        .catch(done);
    });
  });
});
