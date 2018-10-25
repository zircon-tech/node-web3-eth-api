import express from 'express';
import validate from 'express-validation';
import { documentValidator as validator } from '../validators';
import controllers from '../controllers';

const { documentCtrl } = controllers;

const router = express.Router(); // eslint-disable-line

router
  .route('/')

  /** GET /api/users - Get list of users */
  .get(documentCtrl.list);

  /** POST /api/users - Create new user */
  // .post(validate(validator.createDocument), documentCtrl.create);

// router
//   .route('/:documentId')

//   /** GET /api/users/:userId - Get user */
//   .get(documentCtrl.get);

export default router;
