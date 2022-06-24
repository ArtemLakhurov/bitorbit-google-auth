const backend = require('../api')

const getCSRF = async (network, host) => {
  try {
    const { token } = await backend.getCSRF(network, host)
    return token
  } catch (error) {
    console.log("Get CSRF Token Error:  ", error);
    throw new Error(`"Get CSRF Token Error:  ", ${error}`)
  }

  return null
}

module.exports = {
  getCSRF,
}
