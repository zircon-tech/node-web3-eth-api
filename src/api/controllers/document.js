import db from '../../services/sequelize';

const { Document } = db;

const list = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const documents = await Document.findAll({ limit, offset });
    res.json(documents);
  } catch (err) {
    next(err);
  }
};

export default { list };
