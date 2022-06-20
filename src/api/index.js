import axios from 'axios'
import { Connection } from '@velas/web3'

function Backend () {}

Backend.prototype.backendRequest = async function (
  name,
  type = 'get',
  json = false,
  network,
  hostURL
) {
  const host = hostURL || process.env.ACCOUNT_RESOLVER_HOST;

  if (type === 'get') {
    const response = await axios.get(host + name, json ? { params: json } : undefined)

    return response.data
  } else if (type === 'post') {
    try {
      const response = await axios.post(host + name, json, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error backendRequest: ', error)
    }
  }
}

Backend.prototype.resolverRequest = async function (name, data, network) {
  const node_host = config[network].node_host

  const response = await axios.post(
    node_host,
    {
      id: 'id',
      jsonrpc: '2.0',
      method: name,
      params: data,
    },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )

  return await response.data
}

Backend.prototype.getVelasTicker = async function (network) {
  const velas_rates = config[network].velas_rates

  const response = await axios.get(velas_rates)

  return await response.data
}

Backend.prototype.getEVMTokenBalances = async function (address, network) {
  const host = config[network].evm_explorer

  const evm_explorer = `${host}/api`

  const token_balances_url = `${evm_explorer}?module=account&action=tokenlist&address=${address}`

  const response = await axios.get(token_balances_url)

  return await response.data
}

Backend.prototype.registration = async function (data, network) {
  return await this.backendRequest('/registration', 'post', data, network)
}

Backend.prototype.info = async function (id) {
  return await this.backendRequest(`/info?id=${id}`, 'get', false, network)
}

Backend.prototype.addOperationalAddress = async function (data, network) {
  return await this.backendRequest('/add/operational/address', 'post', data, network)
}

Backend.prototype.extendOperationalScopes = async function (data, network) {
  return await this.backendRequest('/extend/operational/scopes', 'post', data, network)
}

Backend.prototype.removeOperationalAddress = async function (data, network) {
  return await this.backendRequest('/remove/operational/address', 'post', data, network)
}

Backend.prototype.replaceOwner = async function (data, network) {
  return await this.backendRequest('/replace/owner', 'post', data, network)
}

Backend.prototype.addOwner = async function (data, network) {
  return await this.backendRequest('/add/owner', 'post', data, network)
}

Backend.prototype.accounts = async function (key, network) {
  return await this.resolverRequest('getVelasAccountsByOwnerKey', [key], network)
}

Backend.prototype.accountTransactions = async function (address, network) {
  return await this.resolverRequest(
    'getConfirmedSignaturesForAddress2',
    [address, { limit: 100 }],
    network
  )
}

Backend.prototype.getConfirmedTransaction = async function (signature, network) {
  const connection = new Connection(`${config[network].node_host}/rpc`)

  return await connection.getConfirmedTransaction(signature)
}

Backend.prototype.getCSRF = async function (network, host) {
  return await this.backendRequest('/csrf', 'get', false, network, host)
}

Backend.prototype.showBalance = async function (address, network) {
  return await this.resolverRequest('getBalance', [address], network)
}

Backend.prototype.evmTokenTransfers = async function (address, network) {
  const host = config[network].evm_explorer

  return await this.backendRequest(
    `?module=account&action=tokentx&address=${address}`,
    'get',
    false,
    network,
    `${host}/api`
  )
}

Backend.prototype.evmTransactions = async function (address, network) {
  const host = config[network].evm_explorer

  return await this.backendRequest(
    `?module=account&action=txlist&address=${address}`,
    'get',
    false,
    network,
    `${host}/api`
  )
}

Backend.prototype.fetchTransactions = async function (address, params, network) {
  const host = config[network].account_host

  return await this.backendRequest(
    `transactions/${address}`,
    'get',
    params,
    network,
    'https://api-history.testnet.velas.com/'
  )
}

export const backend = new Backend()
