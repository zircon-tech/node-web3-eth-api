import express from 'express';
import validate from 'express-validation';
import validators from '../validators';
import controllers from '../controllers';

const { documentValidator } = validators;
const { documentCtrl } = controllers;

const router = express.Router(); // eslint-disable-line

router
  .route('/')

  /** GET /api/documents - Get list of documents */
  .get(documentCtrl.list)

  /** POST /api/documents - Create new document */
  .post(validate(documentValidator.createDocument), documentCtrl.create);

// router
//   .route('/:documentId')

//   /** GET /api/users/:userId - Get user */
//   .get(documentCtrl.get);

export default router;
