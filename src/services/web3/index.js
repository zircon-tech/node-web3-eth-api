import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import TxUtil from 'ethereumjs-util';
import logger from '../express/logger';
import {
  ethHttpProvider,
  ethSocketProvider,
  ethThingContractAddress,
  ethPrivateKey,
  ethDefaultAccountAddress,
} from '../../config';
import ThingContractABI from './ThingContractABI.json';

const defaultPK = Buffer.from(ethPrivateKey, 'hex');
let globalNonce = 0;

export const web3 = new Web3(new Web3.providers.HttpProvider(ethHttpProvider));
export const web3Socket = new Web3(new Web3.providers.WebsocketProvider(ethSocketProvider));

export const httpThingContract = new web3.eth.Contract(
  ThingContractABI,
  ethThingContractAddress
);
export const socketThingContract = new web3Socket.eth.Contract(
  ThingContractABI,
  ethThingContractAddress
);

export const signNotarizeTx = async (id, hash) => {
  try {
    const bytes32Hash = `0x${hash}`;
    const encoded = httpThingContract.methods.notarize(id, bytes32Hash).encodeABI();
    let txCount = await web3.eth.getTransactionCount(ethDefaultAccountAddress, 'pending');
    if (globalNonce === 0) {
      globalNonce = txCount;
    } else if (txCount <= globalNonce) {
      logger.info('Concurrent TX');
      globalNonce += 1;
      txCount = globalNonce;
    } else {
      globalNonce = txCount;
    }
    logger.info(`TX count is: ${txCount}`);
    const gasPrice = await web3.eth.getGasPrice();

    const estimatedGas = await httpThingContract.methods.notarize(id, bytes32Hash).estimateGas({
      from: ethDefaultAccountAddress,
      to: ethThingContractAddress,
      gas: Math.ceil(gasPrice * 1.20),
    });

    const rawTx = {
      from: ethDefaultAccountAddress,
      to: ethThingContractAddress,
      data: encoded,
      gasLimit: estimatedGas * 1.20,
      gasPrice: gasPrice * 1.20,
      nonce: web3.utils.toHex(txCount),
    };

    const tx = new Tx(rawTx);
    tx.sign(defaultPK);

    const txHash = TxUtil.bufferToHex(tx.hash(true));
    logger.info(`TX Hash: ${txHash}`);

    return {
      tx,
      txHash,
    };
  } catch (err) {
    throw err;
  }
};

export const sendNotarizeTx = async (tx) => {
  logger.info('Sending signed TX');
  const serializedTx = tx.serialize();
  const raw = `0x${serializedTx.toString('hex')}`;
  await web3.eth.sendSignedTransaction(raw);
  logger.info('Signed TX sent');
};

export const getConfirmations = async (txHash) => {
  const trx = await web3.eth.getTransaction(txHash);
  // Get current block number
  const currentBlock = await web3.eth.getBlockNumber();

  // When transaction is unconfirmed, its block number is null.
  // In this case we return 0 as number of confirmations
  const confirmations = !trx || trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber;

  return confirmations;
};
