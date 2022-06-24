const tweetnacl = require('tweetnacl')
const solanaWeb3 = require('@solana/web3.js')
const base58 = require('bs58')

const createEphemeralKeys = () => {
  const { publicKey, secretKey } = tweetnacl.box.keyPair()
  return {
    publicKey: base58.encode(publicKey),
    secretKey: base58.encode(secretKey),
  }
}

const isValidAddress = (address) => {
  try {
    new solanaWeb3.PublicKey(address)
    return true
  } catch (_) {}

  return false
}

module.exports = {
  createEphemeralKeys,
  isValidAddress,
}
