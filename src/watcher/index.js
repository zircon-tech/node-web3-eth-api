import sequelize from 'sequelize';
import request from 'request';
import logger from '../services/express/logger';
import db from '../services/sequelize';
import { getConfirmations } from '../services/web3';
import { ethConfirmations, clientCallbackUrl } from '../config';

const { lt } = sequelize.Op;

const { Thing } = db;

const getPendingThings = async () => {
  const things = await Thing.findAll({
    attributes: ['id', 'tx', 'hash', 'status'],
    where: { status: { [lt]: 2 } },
  });
  return things.map(d => ({
    id: d.id,
    tx: d.tx,
    hash: d.hash,
    status: d.status,
  }));
};

const setThingStatus = async (id, status = 0) => {
  await Thing.update({ status }, { where: { id } });
};

const confirmTransaction = async (thing) => {
  if (thing && clientCallbackUrl) {
    return request.post(clientCallbackUrl, { json: { ...thing } }, (error) => {
      if (error) logger.error(`Error calling client callback for thing: ${thing.id} -- ERR: ${error}`);
    });
  }
  return Promise.resolve();
};

const watchContractTransactions = async () => {
  setTimeout(async () => {
    try {
      logger.info('Watching pending transactions');
      const pendingThings = await getPendingThings();

      await Promise.all(
        pendingThings.map(async (thing) => {
          if (thing.tx) {
            const confirmations = await getConfirmations(thing.tx);

            if (confirmations >= ethConfirmations) {
              logger.info(`Status change to 2 for id: ${thing.id}`);
              await setThingStatus(thing.id, 2);
              await confirmTransaction(thing);
            } else if (thing.status === 0 && confirmations > 0) {
              logger.info(`Status change to 1 for id: ${thing.id}`);
              await setThingStatus(thing.id, 1);
            }
          }
        })
      );

      watchContractTransactions();
    } catch (err) {
      logger.error('Watcher error: ', err);
      logger.info('Reconnecting watcher');

      watchContractTransactions();
    }
  }, 30 * 1000);
};

export default { watchContractTransactions };
