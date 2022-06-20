const { backend } = require("../api")

const getCSRF = async (network, host) => {
  try {
    const { token } = await backend.getCSRF(network, host)

    return token
  } catch (error) {
    console.log(error)
  }

  return null
}

module.exports = getCSRF;
