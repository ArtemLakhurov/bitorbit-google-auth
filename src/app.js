const express = require('express')
const { findRequest, saveRequest } = require('./redis/index.js')
const {
  createVelasAccount,
  initializeVelasAccount,
} = require('./velas-account/index.js')
const { getGoogleAccountData } = require('./api/google.js')
const { createEphemeralKeys } = require('./utils/keys.js')
require('dotenv').config()

const app = express()
const port = 3001

app.use(express.json())

const createNewAccount = async (email, publicKey) => {
  const accountData = await createVelasAccount()
  console.log(accountData);
  await saveRequest(email, accountData.secretKey)
  await initializeVelasAccount(
    accountData.address,
    accountData.secretKey,
    publicKey
  )
}

const tryLogin = async (req) => {
  const { token, opKeyPublicKey, timestamp, isCreateAccount } = req.body
  try {
    const { email } = await getGoogleAccountData(token)
    if (isCreateAccount) {
      const { publicKey } = createEphemeralKeys()
      await createNewAccount(email, publicKey)
    }
  } catch (error) {
    throw new Error(error)
  }
}

app.post('/try-login', (req, res) => {
  tryLogin(req, res).catch((error) => {
    res.send(error.message)
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
