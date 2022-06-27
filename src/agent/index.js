const Agent = require('@velas/account-agent')
const solanaWeb3 = require('@solana/web3.js')
const tweetnacl = require('tweetnacl');
const { findRequest } = require('../redis/index')
const broadcastTransactionHendler = require('./broadcast');
const base58 = require('bs58');

const StorageHandler = class StorageHandler {
  constructor() {}
}

const KeyStorageHandler = class KeyStorageHandler {
  constructor() {}
  async signWithKey(id, payload) {
    try {
      console.log('id: ', id);
      const secret = await findRequest(`*:${id}`);
      const result = tweetnacl.sign.detached(payload, new Uint8Array(id))
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

console.log({
  client_host: process.env.NODE_HOST,
  client_account_contract: process.env.ACCOUNT_CONTRACT,
  transactions_sponsor_pub_key: process.env.BACKEND_ACCOUNT,
})

module.exports = new Agent({
  client_host: process.env.NODE_HOST,
  client_account_contract: process.env.ACCOUNT_CONTRACT,
  transactions_sponsor_pub_key: process.env.BACKEND_ACCOUNT,
  client_provider: solanaWeb3,
  StorageHandler,
  KeyStorageHandler,
  broadcastTransactionHendler,
})
