const Agent = require('../agent/index.js')
const sendMessage = require('../utils/index.js')
const { isValidAddress, createEphemeralKeys } = require('../utils/keys')

const createVelasAccount = async () => {
  const { publicKey, secretKey } = createEphemeralKeys()
  const address = await findAccountAddressWithPublicKey(publicKey)
  return { address, publicKey, secretKey }
}

const findAccountAddressWithPublicKey = async (publicKey) => {
  return await Agent.provider.client.findAccountAddressWithPublicKey(publicKey)
}

const getIsAccountInitialized = async (address) => {
  console.log(
    'getIsAccountInitialized: ',
    !!(await Agent.provider.client.getAccountData(address))
  )
  return !!(await Agent.provider.client.getAccountData(address))
}

const addOperationAddress = async (
  address,
  ownerPrivateKey,
  opKeyPublicKey
) => {
  if (!getIsAccountInitialized(address))
    await initializeVelasAccount(address, ownerPrivateKey, opKeyPublicKey)

  const { success, error } = await sendMessage(
    'addOperationalAddressTransaction',
    {
      op_key: opKeyPublicKey,
      account: address,
      secretOperationalOrOwner: ownerPrivateKey,
      agent_type: process.env.DEVICE_NAME,
      transactions_sponsor_pub_key: process.env.TRANSACTION_SPONSOR_PUB_KEY,
    },
    process.env.VELAS_NETWORK
  )

  if (error || !success)
    return { status: 'failed', error: error || 'Something went wrong' }

  return { status: 'success' }
}
const initializeVelasAccount = async (
  address,
  ownerPrivateKey,
  opKeyPublicKey
) => {
  try {
    if (getIsAccountInitialized(address)) {
      return 'Account already initialized'
    }
    if (await !isValidAddress(address)) {
      console.log('Adderss is not valid')
      return { status: 'failed', error: 'address not valid' }
    }
    const { success, error } = await sendMessage(
      'initializeTransaction',
      {
        secret: ownerPrivateKey,
        op_key: opKeyPublicKey,
        agent_type: process.env.DEVICE_NAME,
        transactions_sponsor_pub_key: process.env.TRANSACTION_SPONSOR_PUB_KEY,
      },
      process.env.VELAS_NETWORK
    )
    console.log('Error: ', error)
    if (error || !success) {
      throw new Error(`Initialize Transaction Error: ${error.description}`)
    }
    console.log('Initialize Transaction Success')
    return { status: 'success' }
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

module.exports = {
  createVelasAccount,
  initializeVelasAccount,
  addOperationAddress,
  findAccountAddressWithPublicKey,
  getIsAccountInitialized,
}
