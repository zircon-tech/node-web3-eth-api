import express from 'express';
import validate from 'express-validation';
import validators from '../validators';
import controllers from '../controllers';

const { thingValidator } = validators;
const { thingCtrl } = controllers;

const router = express.Router(); // eslint-disable-line

router
  .route('/')

  /** GET /api/things - Get list of things */
  .get(thingCtrl.list)

  /** POST /api/things - Create new thing */
  .post(validate(thingValidator.createThing), thingCtrl.create);

router
  .route('/:id')

  /** GET /api/things/:id - Get thing */
  .get(validate(thingValidator.getThing), thingCtrl.get);

export default router;
