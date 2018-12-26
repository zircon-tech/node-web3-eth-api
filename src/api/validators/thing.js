import Joi from 'joi';

export default {
  // POST /things
  createThing: {
    body: {
      id: Joi.string().required(),
      hash: Joi.string().required(),
    },
  },
  getThing: {
    params: {
      id: Joi.string().required(),
    },
  },
};
