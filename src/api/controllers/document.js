import httpStatus from 'http-status';
import db from '../../services/sequelize';
import APIError from '../helpers/APIError';

const { Document, DocumentVersion } = db;

const create = async(req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    let [document, version] = await Promise.all([
      Document.findById(req.body.id),
      DocumentVersion.findOne({
        where: {
          documentId: req.body.id,
          hash: req.body.hash,
        },
      }),
    ]);

    if (version) {
      return next(new APIError('A document with provided id and hash already exists', httpStatus.BAD_REQUEST, true));
    }

    if (!document) {
      document = await Document.create({
        id: req.body.id,
      }, { transaction: t });
    }
    version = await DocumentVersion.create({
      documentId: document.id,
      hash: req.body.hash,
    }, { transaction: t });

    version = version.toJSON();
    version.id = document.id;

    t.commit();

    res.json(version);
  } catch (err) {
    t.rollback();
    next(err);
  }
};


const list = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const documents = await Document.findAll({
      include: {
        model: DocumentVersion,
        as: 'versions',
      },
      limit: Number(limit),
      offset: Number(offset),
    });
    res.json(documents);
  } catch (err) {
    next(err);
  }
};

export default { create, list };
