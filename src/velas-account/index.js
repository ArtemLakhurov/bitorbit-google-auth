const Agent = require('../agent/index.js')
const sendMessage = require('../utils/index.js')
const { isValidAddress, createEphemeralKeys } = require('../utils/keys')

const createVelasAccount = async () => {
  const { publicKey, secretKey } = createEphemeralKeys()
  const address = await Agent.provider.client.findAccountAddressWithPublicKey(
    publicKey
  )
  return { address, publicKey, secretKey }
}

const getIsAccountInitialized = async (address) => {
  console.log(await Agent.provider.client.getAccountData(address))
  return !!(await Agent.provider.client.getAccountData(address))
}

const initializeVelasAccount = async (
  address,
  ownerPrivateKey,
  opKeyPublicKey
) => {
  try {
    // if (getIsAccountInitialized(address)) {
    //   return 'Account already initialized';
    // }
    if (await !isValidAddress(address))
      return { status: 'failed', error: 'address not valid' }
    const { success, error } = await sendMessage(
      'initializeTransaction',
      {
        secret: ownerPrivateKey,
        op_key: opKeyPublicKey,
        agent_type: process.env.DEVICE_NAME,
        transactions_sponsor_pub_key:
          'EgJX7GpswpA8z3qRNuzNTgKKjPmw1UMfh5xQjFeVBqAK',
        scopes: ['VAcccHVjpknkW5N5R9sfRppQxYJrJYVV7QJGKchkQj5:11'],
      },
      process.env.VELAS_NETWORK
    )
    console.log(error)
    if (error || !success)
      throw new Error(`Initialize Transaction Error: ${error.description}`)
    return { status: 'success' }
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

module.exports = {
  createVelasAccount,
  initializeVelasAccount,
}
