const Agent = require('@velas/account-agent')
const velasWeb3 = require('@velas/web3')
const tweetnacl = require('tweetnacl')
const { findRequest } = require('../redis/index')
const broadcastTransactionHendler = require('./broadcast')
const base58 = require('bs58')

const StorageHandler = class StorageHandler {
  constructor() {}
}

const KeyStorageHandler = class KeyStorageHandler {
  constructor() {}
  async signWithKey(id, payload) {
    try {
      console.log('Id: ', id)
      const secret = await findRequest(`*:${id}`)
      const result = tweetnacl.sign.detached(payload, new Uint8Array(id))
      return result
    } catch (error) {
      console.error(error)
    }
  }
}

console.log('Agent config: ', {
  client_host: process.env.NODE_HOST,
  client_account_contract: process.env.ACCOUNT_CONTRACT,
  transactions_sponsor_pub_key: process.env.BACKEND_ACCOUNT,
})

module.exports = new Agent({
  client_host: process.env.NODE_HOST,
  client_account_contract: process.env.ACCOUNT_CONTRACT,
  transactions_sponsor_pub_key: process.env.BACKEND_ACCOUNT,
  client_provider: velasWeb3,
  StorageHandler,
  KeyStorageHandler,
  broadcastTransactionHendler,
})
