const agent = require('../agent')
const { getCSRF } = require('./csrf')

const sendMessage = async (
  transaction_name,
  params,
  network = 'testnet',
  sponsor_host = process.env.BACKEND_HOST
) => {
  const csrfToken = await getCSRF(network, sponsor_host)
  return new Promise((resolve) => {
    agent.provider.client.sendMessage({
      params,
      transaction_name,
      csrf_token: csrfToken,
      transactions_sponsor_api_host: sponsor_host,
      cb: (error, success) => {
        resolve({ error, success })
      },
    })
  })
}

module.exports = sendMessage
