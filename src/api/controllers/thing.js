import httpStatus from 'http-status';
import db from '../../services/sequelize';
import APIError from '../helpers/APIError';
import { signNotarizeTx, sendNotarizeTx } from '../../services/web3';
import logger from '../../services/express/logger';

const { Thing } = db;

const create = async(req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    let thing = await Thing.findOne({
      where: {
        thingId: req.body.id,
        hash: req.body.hash,
      },
    });

    if (thing) {
      return next(new APIError('A thing with provided id and hash already exists', httpStatus.BAD_REQUEST, true));
    }

    logger.info('Notarizing thing to blockchain');
    const txResult = await signNotarizeTx(req.body.id, req.body.hash);

    if (!txResult || !txResult.tx || !txResult.txHash) {
      return next(new APIError('Transaction could not be confirmed in the Blockchain. Please try submitting again', httpStatus.UNPROCESSABLE_ENTITY, true));
    }

    thing = await Thing.create({
      hash: req.body.hash,
      tx: txResult.txHash,
    }, { transaction: t });

    await t.commit();

    res.json(thing);

    // Sent async on purpose. Might take too long
    await sendNotarizeTx(txResult.tx);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const get = async (req, res, next) => {
  try {
    const thing = await Thing.findById(req.params.id);
    if (!thing) {
      return next(new APIError('Thing not found', httpStatus.NOT_FOUND, true));
    }

    res.json(thing);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const things = await Thing.findAll({
      limit: Number(limit),
      offset: Number(offset),
    });
    res.json(things);
  } catch (err) {
    next(err);
  }
};

export default { create, get, list };
