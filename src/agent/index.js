const Agent = require('@velas/account-agent');
const solanaWeb3 = require('@solana/web3.js');
const broadcastTransactionHendler = require('./broadcast');

console.log(process.env.ACCOUNT_BACKEND_NODE_HOST);

const StorageHandler = class StorageHandler {
  constructor() {
  }
}

const KeyStorageHandler = class KeyStorageHandler {
  constructor() {
  }
}

module.exports = new Agent({
  client_host: process.env.BACKEND_HOST,
  client_account_contract: process.env.ACCOUNT_CONTRACT,
  backend_payer_public_key: process.env.ACCOUNT_ADDRESS,
  client_provider: solanaWeb3,
  StorageHandler,
  KeyStorageHandler,
  broadcastTransactionHendler,
});
