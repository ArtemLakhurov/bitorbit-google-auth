const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
  url: process.env.REDIS_HOST,
})

client.connect()

client.on('connect', () => {
  console.log('Redis client connected')
})

client.on('error', error => {
  console.error(error)
})

const saveRequest = async (email, data) => {
  const expDate = 60 * 60 * 24
  return client
    .set(email, expDate, JSON.stringify(data))
    .catch(err => {
      if (err) console.error('saveRequest', err)
    })
}

const findRequest = async email => {
  const request = await client
    .get(email)
    .then(a => (a ? JSON.parse(a) : null))
    .catch(err => {
      if (err) console.error('findRequest', err)
    })

  if (!request) return null

  const expireDate = new Date(new Date(request.created).getTime() + 5 * 60000)

  return { ...request, expired: expireDate.getTime() < new Date().getTime() }
}

const cancelRequest = async id => {
  const request = await findRequest(id)

  saveRequest(id, { ...request, canceled: true })
}

const addUserAccount = async (id, account) => {
  const accounts = (await findUserAccounts(id)) || []

  return client
    .set(`telegram:${id}`, JSON.stringify([account, ...accounts]))
    .catch(err => {
      if (err) console.error('addUserAccount', err)
    })
}

const deleteUserAccount = async (id, account) => {
  if (!id || !account) throw Error('Missing arguments')

  const accounts = (await findUserAccounts(id)) || []

  return client
    .set(`telegram:${id}`, JSON.stringify(accounts.filter(a => a !== account)))
    .catch(err => {
      if (err) console.error('deleteUserAccount', err)
    })
}

const findUserAccounts = async id => {
  const accounts = await client
    .get(`telegram:${id}`)
    .then(a => (a ? JSON.parse(a) : null))
    .catch(err => {
      if (err) console.error('findUserAccounts', err)
    })

  return accounts
}

module.exports = {
  saveRequest,
  findRequest,
  cancelRequest,
  addUserAccount,
  // findUserAccount,
  findUserAccounts,
  deleteUserAccount
}

// module.exports = client
