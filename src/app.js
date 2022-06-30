const express = require('express')
const { findRequest, saveRequest } = require('./redis/index.js')
const {
  createVelasAccount,
  addOperationAddress,
  findAccountAddressWithPublicKey,
  initializeVelasAccount,
} = require('./velas-account/index.js')
const { getGoogleAccountData } = require('./api/google.js')
require('dotenv').config()

const app = express()
const port = 3001

app.use(express.json())

const createNewAccount = async (email, publicKey) => {
  const accountData = await createVelasAccount()
  await saveRequest(`${email}`, {
    secretKey: accountData.secretKey,
    publicKey: accountData.publicKey,
  })
  return accountData
}

const login = async (ownerPublicKey, ownerPrivateKey, opKeyPublicKey) => {
  try {
    const address = await findAccountAddressWithPublicKey(ownerPublicKey)
    await addOperationAddress(address, ownerPrivateKey, opKeyPublicKey)
    return address
  } catch (error) {
    throw new Error(`Login Error: ${error}`)
  }
}

const createAccount = async (email, opKeyPublicKey) => {
  const account = await createNewAccount(email, opKeyPublicKey)
  await addOperationAddress(account.address, account.secretKey, opKeyPublicKey)
  return account.address
}

const validReqBody = (body) => {
  if (!body.token) {
    throw new Error('Token is required')
  }
  if (!body.opKeyPublicKey) {
    throw new Error('opKeyPublicKey is required')
  }
  if (!body.timestamp) {
    throw new Error('timestamp is required')
  }
  return body
}

const tryLogin = async (req, res) => {
  try {
    const {
      token,
      opKeyPublicKey,
      timestamp,
      isCreateAccount = false,
    } = validReqBody(req.body)
    const { email } = await getGoogleAccountData(token)
    const ownerKeys = await findRequest(email)
    if (ownerKeys) {
      const address = await login(
        ownerKeys.publicKey,
        ownerKeys.secretKey,
        opKeyPublicKey
      )
      return address
    } else {
      if (isCreateAccount) {
        const address = await createAccount(email, opKeyPublicKey)
        return address
      } else {
        throw new Error("Account doesn't exist")
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

app.post('/try-login', (req, res) => {
  tryLogin(req, res)
    .then((address) => res.send(address))
    .catch((error) => {
      res.send({ message: error.message })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
