import sequelize from 'sequelize';
import request from 'request';
import logger from '../services/express/logger';
import db from '../services/sequelize';
import { getConfirmations } from '../services/web3';
import { ethConfirmations, clientCallbackUrl } from '../config';

const { lt } = sequelize.Op;

const { DocumentVersion } = db;

const getPendingDocuments = async () => {
  const documents = await DocumentVersion.findAll({
    attributes: ['id', 'tx', 'hash', 'status'],
    where: { status: { [lt]: 2 } },
  });
  return documents.map(d => ({
    id: d.id,
    tx: d.tx,
    hash: d.hash,
    status: d.status,
  }));
};

const setDocumentStatus = async (id, status = 0) => {
  await DocumentVersion.update({ status }, { where: { id } });
};

const confirmTransaction = async (document) => {
  if (document && clientCallbackUrl) {
    return request.post(clientCallbackUrl, { json: { ...document } }, (error) => {
      if (error) logger.error(`Error calling client callback for document: ${document.id} -- ERR: ${error}`);
    });
  }
  return Promise.resolve();
};

const watchContractTransactions = async () => {
  setTimeout(async () => {
    try {
      logger.info('Watching pending transactions');
      const pendingDocuments = await getPendingDocuments();

      await Promise.all(
        pendingDocuments.map(async (doc) => {
          if (doc.tx) {
            const confirmations = await getConfirmations(doc.tx);

            if (confirmations >= ethConfirmations) {
              logger.info(`Status change to 2 for id: ${doc.id}`);
              await setDocumentStatus(doc.id, 2);
              await confirmTransaction(doc);
            } else if (doc.status === 0 && confirmations > 0) {
              logger.info(`Status change to 1 for id: ${doc.id}`);
              await setDocumentStatus(doc.id, 1);
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
