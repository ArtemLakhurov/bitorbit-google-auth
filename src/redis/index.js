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
  return client
    .set(email, JSON.stringify(data), )
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

module.exports = {
  saveRequest,
  findRequest,
  cancelRequest,
  // findUserAccount,
}

// module.exports = client
