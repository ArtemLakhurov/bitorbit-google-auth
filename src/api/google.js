const CLIENT_ID = process.env.CLIENT_ID
const { OAuth2Client } = require('google-auth-library')
const axios = require('axios')

const getGoogleAccountData = async (token) => {
  await verify(token);
  const requestProfileData = await axios.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
  )
  return requestProfileData.data
}

const verify = async (token) => {
  const client = new OAuth2Client(CLIENT_ID)
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    })
    const payload = ticket.getPayload()
    const userid = payload['sub']
  } catch (error) {
    if (error.message.includes('Token used too late')) {
      console.log('Token used too late')
      throw new Error('Token used too late')
    }
    console.error('verify ', error)
  }
}

module.exports = {
  verify,
  getGoogleAccountData,
}
