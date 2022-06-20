const agent = require("../agent");
const getCSRF = require("./csrf");

const sendMessage = async (
  transaction_name,
  params,
  network = 'mainnet',
  sponsor_host = null
) => {
  const host = sponsor_host || config[network].account_host
  const csrfToken = await getCSRF(network, host)

  return new Promise(resolve => {
    agent.provider.client.sendMessage({
      params,
      transaction_name,
      csrf_token: csrfToken,
      transactions_sponsor_api_host: host,
      cb: (error, success) => {
        resolve({ error, success })
      },
    });
  });
};

module.exports = sendMessage;
