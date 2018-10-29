import sequelize from 'sequelize';
import logger from '../services/express/logger';
import db from '../services/sequelize';
import { getConfirmations } from '../services/web3';
import { ethConfirmations } from '../config';

const { lt } = sequelize.Op;

const { DocumentVersion } = db;

const getPendingDocuments = async () => {
  const documents = await DocumentVersion.findAll({
    attributes: ['id', 'tx', 'status'],
    where: { status: { [lt]: 2 } },
  });
  return documents.map(d => ({
    id: d.id,
    txHash: d.tx,
    status: d.status,
  }));
};

const setDocumentStatus = async (id, status = 0) => {
  await DocumentVersion.update(
    { status },
    { where: { id } },
  );
};

const watchContractTransactions = async () => {
  setTimeout(async () => {
    try {
      logger.info('Watching pending transactions');
      const pendingDocuments = await getPendingDocuments();

      await Promise.all(pendingDocuments.map(async ({ txHash, status, id }) => {
        if (txHash) {
          const confirmations = await getConfirmations(txHash);

          if (confirmations >= ethConfirmations) {
            logger.info(`Status change to 2 for id: ${id}`);
            await setDocumentStatus(id, 2);
          } else if (status === 0 && confirmations > 0) {
            logger.info(`Status change to 1 for id: ${id}`);
            await setDocumentStatus(id, 1);
          }
        }
      }));

      watchContractTransactions();
    } catch (err) {
      logger.error('Watcher error: ', err);
      logger.info('Reconnecting watcher');

      watchContractTransactions();
    }
  }, 30 * 1000);
};

export default { watchContractTransactions };
