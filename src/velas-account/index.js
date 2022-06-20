const Agent = require('../agent/index.js');
const sendMessage = require('../utils/index.js');
const { isValidAddress, createEphemeralKeys } = require("../utils/keys");

const createVelasAccount = async () => {
  const { publicKey, secretKey } = createEphemeralKeys();
  const address = await Agent.provider.client.findAccountAddressWithPublicKey(publicKey);
  return {address, publicKey, secretKey};
};

const initializeVelasAccount = async (address, ownerPrivateKey, opKeyPublicKey) => {
  try {
    if (await !isValidAddress(address)) return { status: 'failed', error: 'address not valid' };
    const { success, error } = await sendMessage('initializeTransaction',
    {
      secret: ownerPrivateKey,
      op_key: opKeyPublicKey,
      agent_type: process.env.DEVICE_NAME,
      scopes: [],
    },
    process.env.VELAS_NETWORK
    )
    if (error || !success) return { status: 'failed', error: error || 'Something went wrong' }
    return { status: 'success' }
  } catch (error) {
    return { status: 'failed', error: _ }
  }


}

module.exports = {
  createVelasAccount,
  initializeVelasAccount,
}
