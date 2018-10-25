import Joi from 'joi';

export default {
  // POST /documents
  createDocument: {
    body: {
      username: Joi.string().required(),
    },
  },
};
