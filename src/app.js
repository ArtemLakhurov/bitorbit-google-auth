const express = require('express');
const axios = require('axios');
const { findRequest, saveRequest } = require('./redis/index.js');
const { createVelasAccount, initializeVelasAccount } = require('./velas-account/index.js');
const { getGoogleAccountData } = require('./api/google.js');

  require('dotenv').config();


const app = express();
const port = 3001;

app.use(express.json());


const createNewAccount = async (email, publicKey) => {
  const accountData = await createVelasAccount();
  await saveRequest(email, accountData.secretKey);
  await initializeVelasAccount(accountData.address, accountData.secretKey, publicKey);

};

const tryLogin = async (req, res) => {
    const { token, opKeyPublicKey, timestamp, isCreateAccount} = req.body;

      try {
        const { email } = await getGoogleAccountData(token);
        if (isCreateAccount) {
          await createNewAccount(email, opKeyPublicKey);
        }
      } catch (error) {
        throw new Error(error);
      }
}

app.post('/try-login', (req, res) => {
  tryLogin(req,res).catch((error) => {
    res.send(error.message);
  });

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
