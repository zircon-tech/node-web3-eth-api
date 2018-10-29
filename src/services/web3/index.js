import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import {
  ethHttpProvider,
  ethSocketProvider,
  ethDocumentContractAddress,
  ethPrivateKey,
  ethDefaultAccountAddress,
} from '../../config';
import DocumentContractABI from './DocumentContractABI.json';

const defaultPK = Buffer.from(ethPrivateKey, 'hex');

export const web3 = new Web3(new Web3.providers.HttpProvider(ethHttpProvider));
export const web3Socket = new Web3(new Web3.providers.WebsocketProvider(ethSocketProvider));

export const httpDocumentContract = new web3.eth.Contract(
  DocumentContractABI,
  ethDocumentContractAddress
);
export const socketDocumentContract = new web3Socket.eth.Contract(
  DocumentContractABI,
  ethDocumentContractAddress
);

export const notarize = async (id, hash) => {
  try {
    // const bytes32Hash = `0x${hash}`; // Change when appropriate
    const encoded = httpDocumentContract.methods.notarize(id, hash).encodeABI();
    const txCount = await web3.eth.getTransactionCount(ethDefaultAccountAddress);
    const gasPrice = await web3.eth.getGasPrice();

    const estimatedGas = await httpDocumentContract.methods.notarize(id, hash).estimateGas({
      from: ethDefaultAccountAddress,
      to: ethDocumentContractAddress,
      gas: gasPrice * 1.20,
    });

    const rawTx = {
      from: ethDefaultAccountAddress,
      to: ethDocumentContractAddress,
      data: encoded,
      gasLimit: estimatedGas * 1.20,
      gasPrice: gasPrice * 1.20,
      nonce: web3.utils.toHex(txCount),
    };

    const tx = new Tx(rawTx);
    tx.sign(defaultPK);

    const serializedTx = tx.serialize();
    const raw = `0x${serializedTx.toString('hex')}`;

    const txHash = await web3.eth.sendSignedTransaction(raw);
    return txHash;
  } catch (err) {
    throw err;
  }
};

export const getConfirmations = async (txHash) => {
  const trx = await web3.eth.getTransaction(txHash);
  // Get current block number
  const currentBlock = await web3.eth.getBlockNumber();

  // When transaction is unconfirmed, its block number is null.
  // In this case we return 0 as number of confirmations
  const confirmations = trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber;

  return confirmations;
};
