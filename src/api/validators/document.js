import Joi from 'joi';

export default {
  // POST /documents
  createDocument: {
    body: {
      id: Joi.string().required(),
      hash: Joi.string().required(),
    },
  },
  getDocument: {
    params: {
      documentId: Joi.string().required(),
    },
  },
};
