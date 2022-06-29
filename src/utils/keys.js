const tweetnacl = require('tweetnacl')
const velasWeb3 = require('@velas/web3')
const base58 = require('bs58')

const createEphemeralKeys = () => {
  const { publicKey, secretKey } = tweetnacl.sign.keyPair()
  return {
    publicKey: base58.encode(publicKey),
    secretKey: base58.encode(secretKey),
  }
}

const isValidAddress = (address) => {
  try {
    new velasWeb3.PublicKey(address)
    return true
  } catch (error) {
    console.log("isValidAddress error: ", error)
  }

  return false
}

module.exports = {
  createEphemeralKeys,
  isValidAddress,
}
