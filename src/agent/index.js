const Agent = require('@velas/account-agent')
const solanaWeb3 = require('@solana/web3.js')
const broadcastTransactionHendler = require('./broadcast')

console.log(process.env.ACCOUNT_BACKEND_NODE_HOST)

const StorageHandler = class StorageHandler {
  constructor() {}
}

const KeyStorageHandler = class KeyStorageHandler {
  constructor() {}
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
