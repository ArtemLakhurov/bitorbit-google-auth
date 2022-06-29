const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const broadcast = (host, body) => {
  return fetch(`${host}/broadcast`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  })
}

const broadcastTransactionHendler = async (host, data = {}) => {
  let body, response, json
  try {
    body = JSON.stringify(data)
  } catch (e) {
    console.warn('[broadcast]', data, e)
    throw new Error(
      'Error while broadcasting transaction handler: input data is not valid.'
    )
  }

  try {
    response = await broadcast(host, body)
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`)
  } catch (e) {
    console.warn('[broadcast]', e)
    throw new Error(
      `Error while broadcasting transaction handler: invalid response from host, ${e.message}`
    )
  }

  try {
    json = response.json()
  } catch (e) {
    console.warn('[broadcast]', response, e)
    throw new Error(
      'Error while broadcasting transaction handler: invalid response from host'
    )
  }

  return json
}

module.exports = broadcastTransactionHendler
