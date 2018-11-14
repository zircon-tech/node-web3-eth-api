import httpStatus from 'http-status';
import db from '../../services/sequelize';
import APIError from '../helpers/APIError';
import { signNotarizeTx, sendNotarizeTx } from '../../services/web3';
import logger from '../../services/express/logger';

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

    logger.info('Notarizing document to blockchain');
    const txResult = await signNotarizeTx(req.body.id, req.body.hash);

    if (!txResult || !txResult.tx || !txResult.txHash) {
      return next(new APIError('Transaction could not be confirmed in the Blockchain. Please try submitting again', httpStatus.UNPROCESSABLE_ENTITY, true));
    }

    version = await DocumentVersion.create({
      documentId: document.id,
      hash: req.body.hash,
      tx: txResult.txHash,
    }, { transaction: t });

    version = version.toJSON();
    version.id = document.id;

    await t.commit();

    res.json(version);

    // Sent async on purpose. Might take too long
    await sendNotarizeTx(txResult.tx);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const get = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.documentId, {
      include: {
        model: DocumentVersion,
        as: 'versions',
      },
      order: [
        [{ model: DocumentVersion, as: 'versions' }, 'created_at', 'asc'],
      ],
    });
    if (!document) {
      return next(new APIError('Document not found', httpStatus.NOT_FOUND, true));
    }

    res.json(document);
  } catch (err) {
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
      order: [
        [{ model: DocumentVersion, as: 'versions' }, 'created_at', 'asc'],
      ],
      limit: Number(limit),
      offset: Number(offset),
    });
    res.json(documents);
  } catch (err) {
    next(err);
  }
};

export default { create, get, list };
